const AuditLog = require("../models/AuditLog");

const logAction = async (req, action, targetUserId = null, details = "") => {
  try {
    await AuditLog.create({
      action,
      performedBy: req.user._id,
      targetUser: targetUserId,
      details,
      ipAddress: req.ip || "",
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};

module.exports = { logAction };
