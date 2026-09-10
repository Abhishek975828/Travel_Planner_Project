const Message = require("../models/Message");
const Trip = require("../models/Trip");

// Get all messages of a trip
const getMessages = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const isMember = trip.members.some(
      (member) =>
        member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this trip",
      });
    }

    const messages = await Message.find({
      trip: trip._id,
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const isMember = trip.members.some(
      (member) =>
        member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this trip",
      });
    }

    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const message = await Message.create({
      trip: trip._id,
      sender: req.user._id,
      text: text.trim(),
    });

    const populatedMessage = await message.populate(
      "sender",
      "name"
    );

    // Send the new message to everyone in this trip
    const io = req.app.get("io");

    if (io) {
      io.to(`trip:${trip._id}`).emit(
        "newMessage",
        populatedMessage
      );
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};