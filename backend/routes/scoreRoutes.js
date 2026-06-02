const express = require("express");
const router = express.Router();
const {
  assignScore, getAllScores, getLeaderboard, getMyScore, getScoreByApplication,
} = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.get("/leaderboard", protect, getLeaderboard);               // both roles
router.get("/my", protect, getMyScore);                            // student
router.get("/application/:applicationId", protect, getScoreByApplication);
router.get("/", protect, isAdmin, getAllScores);                   // admin
router.post("/", protect, isAdmin, assignScore);                   // admin

module.exports = router;
