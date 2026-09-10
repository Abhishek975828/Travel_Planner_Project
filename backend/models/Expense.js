const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0.01,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    splitType: {
      type: String,
      enum: ["equal", "unequal"],
      required: true,
    },
    // Who owes how much for this specific expense. Amounts always sum to `amount`.
    splitAmong: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);