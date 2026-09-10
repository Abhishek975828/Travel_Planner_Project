const express = require("express");

const {
  createTrip,
  joinTrip,
  getMyTrips,
  getTripById,
  removeMember,
} = require("../controllers/tripController");

const {
  getActivities,
  addActivity,
} = require("../controllers/itineraryController");

const {
  getExpenses,
  addExpense,
} = require("../controllers/expenseController");

const { getBalances } = require("../controllers/balanceController");

const {
  getSettlementSuggestions,
  markSettled,
  getSettlementHistory,
} = require("../controllers/settlementController");

const {
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

const tripMemberCheck = require("../middleware/tripMemberCheck");

const router = express.Router();

// All trip routes require a logged-in user
router.use(protect);

router.post("/", createTrip);

router.post("/join", joinTrip);

router.get("/", getMyTrips);

router.get("/:id", tripMemberCheck, getTripById);

router.delete("/:id/members/:userId", tripMemberCheck, removeMember);

// Itinerary routes nested under a trip
router.get("/:id/activities", tripMemberCheck, getActivities);

router.post("/:id/activities", tripMemberCheck, addActivity);

// Expense routes nested under a trip
router.get("/:id/expenses", tripMemberCheck, getExpenses);

router.post("/:id/expenses", tripMemberCheck, addExpense);

// Balance route nested under a trip
router.get("/:id/balances", tripMemberCheck, getBalances);

// Settlement routes nested under a trip
router.get(
  "/:id/settlements/suggestions",
  tripMemberCheck,
  getSettlementSuggestions
);

router.get("/:id/settlements", tripMemberCheck, getSettlementHistory);

router.post("/:id/settlements", tripMemberCheck, markSettled);

// Chat routes nested under a trip
router.get("/:id/messages", tripMemberCheck, getMessages);

router.post("/:id/messages", tripMemberCheck, sendMessage);

module.exports = router;
