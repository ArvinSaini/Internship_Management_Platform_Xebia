const express = require("express");
const router = express.Router();
const {
  getAllInternships, getInternshipById, createInternship,
  updateInternship, deleteInternship, toggleInternshipStatus,
} = require("../controllers/internshipController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// Public/Student — browse
router.get("/", protect, getAllInternships);
router.get("/:id", protect, getInternshipById);

// Admin only
router.post("/", protect, isAdmin, createInternship);
router.put("/:id", protect, isAdmin, updateInternship);
router.delete("/:id", protect, isAdmin, deleteInternship);
router.patch("/:id/toggle-status", protect, isAdmin, toggleInternshipStatus);

module.exports = router;
