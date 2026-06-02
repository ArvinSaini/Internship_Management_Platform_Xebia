const express = require("express");
const router = express.Router();
const {
  applyToInternship, getMyApplications, getAllApplications, updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin, isStudent } = require("../middleware/roleMiddleware");

router.post("/", protect, isStudent, applyToInternship);
router.get("/my", protect, isStudent, getMyApplications);
router.get("/", protect, isAdmin, getAllApplications);
router.patch("/:id/status", protect, isAdmin, updateApplicationStatus);

module.exports = router;
