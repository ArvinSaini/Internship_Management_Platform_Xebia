const asyncHandler = require("express-async-handler");
const authService = require("../services/authService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * @desc    Register new student
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    res.status(400); throw new Error("Please provide all required fields.");
  }
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : "";
  const user = await authService.registerStudent({ name, email, phone, password, profilePicture });
  sendSuccess(res, 201, "Registration submitted. Awaiting admin approval.", {
    id: user._id, name: user.name, email: user.email, approvalStatus: user.approvalStatus,
  });
});

/**
 * @desc    Login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error("Email and password required."); }
  try {
    const { user, token } = await authService.loginUser({ email, password });
    res.cookie("token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccess(res, 200, "Login successful.", { user, token });
  } catch (err) {
    return sendError(res, err.statusCode || 401, err.message);
  }
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "User fetched.", req.user);
});

/**
 * @desc    Logout
 * @route   POST /api/auth/logout
 * @access  Protected
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  sendSuccess(res, 200, "Logged out successfully.");
});

module.exports = { register, login, getMe, logout };
