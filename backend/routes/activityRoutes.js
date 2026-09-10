const express = require("express");
const { updateActivity, deleteActivity } = require("../controllers/itineraryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.put("/:activityId", updateActivity);
router.delete("/:activityId", deleteActivity);

module.exports = router;