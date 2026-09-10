const Trip = require("../models/Trip");
const generateInviteCode = require("../utils/generateInviteCode");

// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const { title, destination, startDate, endDate } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Keep generating a code until we find one that isn't already used
    let inviteCode;
    let codeExists = true;
    while (codeExists) {
      inviteCode = generateInviteCode();
      codeExists = await Trip.findOne({ inviteCode });
    }

    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      createdBy: req.user._id,
      members: [{ user: req.user._id }], // creator auto-joins as a member
      inviteCode,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/trips/join
// @access  Private
const joinTrip = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const trip = await Trip.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!trip) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const alreadyMember = trip.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "You are already a member of this trip" });
    }

    trip.members.push({ user: req.user._id });
    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/trips
// @access  Private
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ "members.user": req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/trips/:id
// @access  Private (must be a trip member — enforced by tripMemberCheck middleware)
const getTripById = async (req, res) => {
  try {
    // req.trip is already loaded by the tripMemberCheck middleware
    const trip = await req.trip.populate("members.user", "name email");
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/trips/:id/members/:userId
// @access  Private (creator only)
const removeMember = async (req, res) => {
  try {
    const trip = req.trip;

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the trip creator can remove members" });
    }

    const { userId } = req.params;

    if (userId === trip.createdBy.toString()) {
      return res.status(400).json({ message: "Trip creator cannot be removed" });
    }

    const memberExists = trip.members.some((m) => m.user.toString() === userId);
    if (!memberExists) {
      return res.status(404).json({ message: "Member not found in this trip" });
    }

    trip.members = trip.members.filter((m) => m.user.toString() !== userId);
    await trip.save();

    res.status(200).json({ message: "Member removed", trip });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createTrip, joinTrip, getMyTrips, getTripById, removeMember };
