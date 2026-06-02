const asyncHandler = require("express-async-handler");
const studentService = require("../services/studentService");
const { sendSuccess } = require("../utils/apiResponse");
const Notification = require("../models/Notification");

const getProfile = asyncHandler(async (req, res) => {
  const user = await studentService.getProfile(req.user._id);
  sendSuccess(res, 200, "Profile fetched.", user);
});

const updateProfile = asyncHandler(async (req, res) => {
  // Parse skills if sent as comma-separated string
  if (req.body.skills && typeof req.body.skills === "string") {
    req.body.skills = req.body.skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  // Parse education if sent as JSON string
  if (req.body.education && typeof req.body.education === "string") {
    req.body.education = JSON.parse(req.body.education);
  }
  // Validate phone is exactly 10 digits if provided
  if (req.body.phone) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(req.body.phone)) {
      res.status(400); throw new Error("Phone number must be exactly 10 digits.");
    }
  }
  const user = await studentService.updateProfile(req.user._id, req.body);
  sendSuccess(res, 200, "Profile updated.", user);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) { res.status(400); throw new Error("Both passwords required."); }
  const result = await studentService.changePassword(req.user._id, currentPassword, newPassword);
  sendSuccess(res, 200, result.message);
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error("Please upload an image."); }
  const user = await studentService.updateProfilePicture(req.user._id, req.file.filename);
  sendSuccess(res, 200, "Profile picture updated.", user);
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error("Please upload a PDF file."); }
  const user = await studentService.uploadResume(req.user._id, req.file.filename);
  sendSuccess(res, 200, "Resume uploaded.", user);
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 }).limit(30);
  sendSuccess(res, 200, "Notifications fetched.", notifications);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  sendSuccess(res, 200, "Marked as read.");
});

const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  sendSuccess(res, 200, "All notifications marked as read.");
});

module.exports = {
  getProfile, updateProfile, changePassword, updateProfilePicture,
  uploadResume, getNotifications, markNotificationRead, markAllRead,
};
