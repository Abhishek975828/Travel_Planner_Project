const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    day: {
      type: Number, // Day 1, Day 2, Day 3... relative to the trip
      required: [true, "Day number is required"],
      min: 1,
    },
    title: {
      type: String,
      required: [true, "Activity title is required"],
      trim: true,
    },
    time: {
      type: String, // simple string like "10:00 AM" — keeps it beginner-friendly
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);