const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerStudent = async ({ name, email, phone, password, profilePicture }) => {
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    if (existing.email === email.toLowerCase()) throw new Error("Email already registered.");
    throw new Error("Phone number already registered.");
  }
  const user = await User.create({ name, email, phone, password, profilePicture, role: "Student" });
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password.");
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error("Invalid email or password.");

  if (user.approvalStatus === "Pending")
    throw { statusCode: 403, message: "Your account is pending admin approval." };
  if (user.approvalStatus === "Rejected")
    throw { statusCode: 403, message: "Your registration has been rejected." };
  if (user.accountStatus === "Inactive")
    throw { statusCode: 403, message: "Your account has been deactivated. Contact administrator." };

  user.lastLogin = new Date();
  await user.save();
  const token = generateToken(user._id, user.role);
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};

module.exports = { registerStudent, loginUser };
