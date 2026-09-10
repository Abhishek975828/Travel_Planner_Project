const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");

// @route   GET /api/trips/:id/balances
// @access  Private (trip members only — tripMemberCheck middleware already ran)
//
// For every expense: the payer's balance goes UP by the full amount (they're owed),
// and each split member's balance goes DOWN by their share (they owe).
// Every recorded settlement then adjusts the balance further, since it represents
// a real payment that already happened outside the app's expense tracking.
// Final balance per user = total paid - total share owed +/- settlements.
// Positive balance  -> this person is owed money overall
// Negative balance  -> this person owes money overall
const getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.trip._id });
    const settlements = await Settlement.find({ trip: req.trip._id });

    // Start every trip member at 0
    const balanceMap = {}; // userId -> balance
    req.trip.members.forEach((m) => {
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

    settlements.forEach((s) => {
      const fromId = s.from.toString();
      const toId = s.to.toString();
      balanceMap[fromId] = (balanceMap[fromId] || 0) + s.amount; // debtor owes less now
      balanceMap[toId] = (balanceMap[toId] || 0) - s.amount; // creditor is owed less now
    });

    // Round to 2 decimals to avoid floating point noise, and populate user info
    const populatedTrip = await req.trip.populate("members.user", "name email");

    const balances = populatedTrip.members.map((m) => {
      const userId = m.user._id.toString();
      const balance = Math.round((balanceMap[userId] || 0) * 100) / 100;
      return {
        user: { _id: m.user._id, name: m.user.name, email: m.user.email },
        balance, // positive = is owed, negative = owes
      };
    });

    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getBalances };