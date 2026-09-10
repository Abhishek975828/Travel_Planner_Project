const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");
const { simplifyDebts } = require("../utils/debtSimplifier");

// Small helper: checks if a user is a member of a given trip
const isTripMember = (trip, userId) =>
  trip.members.some((m) => m.user.toString() === userId.toString());

// Computes each member's net balance for a trip, taking BOTH expenses and
// already-recorded settlements into account.
// Positive = is owed money overall, Negative = owes money overall
const computeBalances = async (trip) => {
  const expenses = await Expense.find({ trip: trip._id });
  const settlements = await Settlement.find({ trip: trip._id });

  const balanceMap = {};
  trip.members.forEach((m) => {
    balanceMap[m.user.toString()] = 0;
  });

  expenses.forEach((expense) => {
    const payerId = expense.paidBy.toString();
    balanceMap[payerId] = (balanceMap[payerId] || 0) + expense.amount;

    expense.splitAmong.forEach((split) => {
      const userId = split.user.toString();
      balanceMap[userId] = (balanceMap[userId] || 0) - split.amount;
    });
  });

  // A settlement means `from` actually paid `to` in real life, so it
  // cancels out part of the outstanding debt calculated above.
  settlements.forEach((s) => {
    const fromId = s.from.toString();
    const toId = s.to.toString();
    balanceMap[fromId] = (balanceMap[fromId] || 0) + s.amount; // debtor owes less now
    balanceMap[toId] = (balanceMap[toId] || 0) - s.amount; // creditor is owed less now
  });

  return Object.entries(balanceMap).map(([userId, balance]) => ({
    userId,
    balance: Math.round(balance * 100) / 100,
  }));
};

// @route   GET /api/trips/:id/settlements/suggestions
// @access  Private (trip members only — tripMemberCheck middleware already ran)
//
// Returns the minimum set of transactions (from -> to : amount) still needed
// to settle every remaining balance in the trip to zero.
const getSettlementSuggestions = async (req, res) => {
  try {
    const balances = await computeBalances(req.trip);
    const transactions = simplifyDebts(balances);

    const populatedTrip = await req.trip.populate("members.user", "name email");
    const userMap = {};
    populatedTrip.members.forEach((m) => {
      userMap[m.user._id.toString()] = { _id: m.user._id, name: m.user.name, email: m.user.email };
    });

    const suggestions = transactions.map((t) => ({
      from: userMap[t.from],
      to: userMap[t.to],
      amount: t.amount,
    }));

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/trips/:id/settlements
// @access  Private (trip members only)
// Body: { to: userId, amount: number }  -- records that req.user paid `to` this amount
const markSettled = async (req, res) => {
  try {
    const { to, amount } = req.body;

    if (!to || !amount) {
      return res.status(400).json({ message: "'to' and 'amount' are required" });
    }

    if (!isTripMember(req.trip, to)) {
      return res.status(400).json({ message: "'to' must be a member of this trip" });
    }

    if (to === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot settle a payment with yourself" });
    }

    const settlement = await Settlement.create({
      trip: req.trip._id,
      from: req.user._id,
      to,
      amount: Number(amount),
    });

    res.status(201).json(settlement);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/trips/:id/settlements
// @access  Private (trip members only)
const getSettlementHistory = async (req, res) => {
  try {
    const settlements = await Settlement.find({ trip: req.trip._id })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ settledAt: -1 });

    res.status(200).json(settlements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSettlementSuggestions, markSettled, getSettlementHistory, computeBalances };