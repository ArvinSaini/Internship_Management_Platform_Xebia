const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  return user;
};

const updateProfile = async (userId, updates) => {
  const allowed = ["name", "phone", "bio", "skills", "education"];
  const filtered = {};
  allowed.forEach((f) => { if (updates[f] !== undefined) filtered[f] = updates[f]; });
  const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true });
  if (!user) throw new Error("User not found.");
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found.");
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect.");
  user.password = newPassword;
  await user.save();
  return { message: "Password changed successfully." };
};

const updateProfilePicture = async (userId, filename) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  if (user.profilePicture) {
    const old = path.join(__dirname, "../uploads", path.basename(user.profilePicture));
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }
  user.profilePicture = `/uploads/${filename}`;
  await user.save();
  return user;
};

const uploadResume = async (userId, filename) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  if (user.resumeUrl) {
    const old = path.join(__dirname, "../uploads", path.basename(user.resumeUrl));
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }
  user.resumeUrl = `/uploads/${filename}`;
  await user.save();
  return user;
};

module.exports = { getProfile, updateProfile, changePassword, updateProfilePicture, uploadResume };
