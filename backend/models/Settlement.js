const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // the person who paid
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // the person who received the payment
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    settledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settlement", settlementSchema);