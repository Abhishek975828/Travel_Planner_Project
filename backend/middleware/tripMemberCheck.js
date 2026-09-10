const mongoose = require("mongoose");
const Trip = require("../models/Trip");

// Verifies the trip exists and the logged-in user is one of its members.
// Attaches the trip document to req.trip for use in the controller.
const tripMemberCheck = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trip id" });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const isMember = trip.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this trip" });
    }

    req.trip = trip;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = tripMemberCheck;
