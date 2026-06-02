const express = require("express");
const router = express.Router();
const {
  getDashboardStats, getAllStudents, getPendingStudents,
  approveStudent, rejectStudent, toggleAccountStatus, deleteStudent,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const AuditLog = require("../models/AuditLog");
const { sendSuccess } = require("../utils/apiResponse");

router.use(protect, isAdmin);

router.get("/stats", getDashboardStats);
router.get("/students", getAllStudents);
router.get("/students/pending", getPendingStudents);
router.patch("/students/:id/approve", approveStudent);
router.patch("/students/:id/reject", rejectStudent);
router.patch("/students/:id/toggle-status", toggleAccountStatus);
router.delete("/students/:id", deleteStudent);

router.get("/audit-logs", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const total = await AuditLog.countDocuments();
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("performedBy", "name email")
    .populate("targetUser", "name email");
  sendSuccess(res, 200, "Audit logs fetched.", { logs, total, page, pages: Math.ceil(total / limit) });
});

module.exports = router;
