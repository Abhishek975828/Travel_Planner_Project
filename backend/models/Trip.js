const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Trip title is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
