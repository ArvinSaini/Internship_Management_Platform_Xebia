const express = require("express");
const router = express.Router();
const {
  getProfile, updateProfile, changePassword, updateProfilePicture,
  uploadResume, getNotifications, markNotificationRead, markAllRead,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);
router.put("/profile-picture", upload.single("profilePicture"), updateProfilePicture);
router.put("/resume", upload.single("resume"), uploadResume);
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.patch("/notifications/read-all", markAllRead);

module.exports = router;
