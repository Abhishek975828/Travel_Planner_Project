const Activity = require("../models/Activity");
const Trip = require("../models/Trip");

// Small helper: checks if a user is a member of a given trip
const isTripMember = (trip, userId) =>
  trip.members.some((m) => m.user.toString() === userId.toString());

// @route   GET /api/trips/:id/activities
// @access  Private (trip members only — tripMemberCheck middleware already ran)
const getActivities = async (req, res) => {
  try {
    // req.trip is attached by tripMemberCheck middleware
    const activities = await Activity.find({ trip: req.trip._id }).sort({ day: 1, createdAt: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/trips/:id/activities
// @access  Private (trip members only)
const addActivity = async (req, res) => {
  try {
    const { day, title, time, notes, cost } = req.body;

    if (!day || !title) {
      return res.status(400).json({ message: "Day and title are required" });
    }

    const activity = await Activity.create({
      trip: req.trip._id,
      day,
      title,
      time,
      notes,
      cost,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/activities/:activityId
// @access  Private (trip members only)
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Verify the logged-in user belongs to the trip this activity is part of
    const trip = await Trip.findById(activity.trip);
    if (!trip || !isTripMember(trip, req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this trip" });
    }

    const { day, title, time, notes, cost } = req.body;

    if (day !== undefined) activity.day = day;
    if (title !== undefined) activity.title = title;
    if (time !== undefined) activity.time = time;
    if (notes !== undefined) activity.notes = notes;
    if (cost !== undefined) activity.cost = cost;

    await activity.save();
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/activities/:activityId
// @access  Private (trip members only)
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const trip = await Trip.findById(activity.trip);
    if (!trip || !isTripMember(trip, req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this trip" });
    }

    await activity.deleteOne();
    res.status(200).json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getActivities, addActivity, updateActivity, deleteActivity };