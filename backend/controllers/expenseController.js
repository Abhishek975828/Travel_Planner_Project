const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
const { calculateEqualSplit, validateUnequalSplit } = require("../utils/splitCalculator");

// Small helper: checks if a user is a member of a given trip
const isTripMember = (trip, userId) =>
  trip.members.some((m) => m.user.toString() === userId.toString());

// @route   GET /api/trips/:id/expenses
// @access  Private (trip members only — tripMemberCheck middleware already ran)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.trip._id })
      .populate("paidBy", "name email")
      .populate("splitAmong.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/trips/:id/expenses
// @access  Private (trip members only)
// Body for equal split:   { description, amount, paidBy, splitType: "equal", splitBetween: [userId, ...] }
// Body for unequal split: { description, amount, paidBy, splitType: "unequal", splits: [{ user, amount }, ...] }
const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, splitType, splitBetween, splits } = req.body;

    if (!description || !amount || !splitType) {
      return res.status(400).json({ message: "Description, amount and splitType are required" });
    }

    if (!["equal", "unequal"].includes(splitType)) {
      return res.status(400).json({ message: "splitType must be 'equal' or 'unequal'" });
    }

    // Default the payer to the logged-in user if not specified
    const payerId = paidBy || req.user._id;
    if (!isTripMember(req.trip, payerId)) {
      return res.status(400).json({ message: "paidBy must be a member of this trip" });
    }

    let splitAmong;

    if (splitType === "equal") {
      const participantIds = splitBetween && splitBetween.length ? splitBetween : req.trip.members.map((m) => m.user);

      const invalidUser = participantIds.find((id) => !isTripMember(req.trip, id));
      if (invalidUser) {
        return res.status(400).json({ message: "All split members must belong to this trip" });
      }

      splitAmong = calculateEqualSplit(Number(amount), participantIds);
    } else {
      const check = validateUnequalSplit(Number(amount), splits);
      if (!check.valid) {
        return res.status(400).json({ message: check.message });
      }

      const invalidUser = splits.find((s) => !isTripMember(req.trip, s.user));
      if (invalidUser) {
        return res.status(400).json({ message: "All split members must belong to this trip" });
      }

      splitAmong = splits.map((s) => ({ user: s.user, amount: Number(s.amount) }));
    }

    const expense = await Expense.create({
      trip: req.trip._id,
      description,
      amount: Number(amount),
      paidBy: payerId,
      splitType,
      splitAmong,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/expenses/:expenseId
// @access  Private (trip members only)
// Accepts the same body shape as addExpense; recalculates the split from scratch.
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const trip = await Trip.findById(expense.trip);
    if (!trip || !isTripMember(trip, req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this trip" });
    }

    const { description, amount, paidBy, splitType, splitBetween, splits } = req.body;

    if (description !== undefined) expense.description = description;
    if (paidBy !== undefined) {
      if (!isTripMember(trip, paidBy)) {
        return res.status(400).json({ message: "paidBy must be a member of this trip" });
      }
      expense.paidBy = paidBy;
    }

    const newAmount = amount !== undefined ? Number(amount) : expense.amount;
    const newSplitType = splitType || expense.splitType;

    if (amount !== undefined || splitType !== undefined || splitBetween || splits) {
      if (newSplitType === "equal") {
        const participantIds =
          splitBetween && splitBetween.length ? splitBetween : trip.members.map((m) => m.user);

        const invalidUser = participantIds.find((id) => !isTripMember(trip, id));
        if (invalidUser) {
          return res.status(400).json({ message: "All split members must belong to this trip" });
        }

        expense.splitAmong = calculateEqualSplit(newAmount, participantIds);
      } else {
        const check = validateUnequalSplit(newAmount, splits || expense.splitAmong);
        if (!check.valid) {
          return res.status(400).json({ message: check.message });
        }

        const sourceSplits = splits || expense.splitAmong;
        const invalidUser = sourceSplits.find((s) => !isTripMember(trip, s.user));
        if (invalidUser) {
          return res.status(400).json({ message: "All split members must belong to this trip" });
        }

        expense.splitAmong = sourceSplits.map((s) => ({ user: s.user, amount: Number(s.amount) }));
      }
      expense.amount = newAmount;
      expense.splitType = newSplitType;
    }

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/expenses/:expenseId
// @access  Private (trip members only)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const trip = await Trip.findById(expense.trip);
    if (!trip || !isTripMember(trip, req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this trip" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };