const User = require("../models/User");
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const AuditLog = require("../models/AuditLog");

const getDashboardStats = async () => {
  const totalStudents = await User.countDocuments({ role: "Student" });
  const pendingApprovals = await User.countDocuments({ role: "Student", approvalStatus: "Pending" });
  const totalApplications = await Application.countDocuments();
  const activeInternships = await Internship.countDocuments({ status: "Active" });
  const selectedApplications = await Application.countDocuments({ status: "Selected" });
  const completedApplications = await Application.countDocuments({ status: "Completed" });
  const recentLogs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("performedBy", "name email")
    .populate("targetUser", "name email");

  return {
    totalStudents, pendingApprovals, totalApplications,
    activeInternships, selectedApplications, completedApplications, recentLogs,
  };
};

const getAllStudents = async (search = "") => {
  const query = { role: "Student" };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  return await User.find(query).sort({ createdAt: -1 });
};

const getPendingStudents = async () =>
  await User.find({ role: "Student", approvalStatus: "Pending" }).sort({ createdAt: -1 });

const approveStudent = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { approvalStatus: "Approved" }, { new: true });
  if (!user) throw new Error("User not found.");
  return user;
};

const rejectStudent = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { approvalStatus: "Rejected" }, { new: true });
  if (!user) throw new Error("User not found.");
  return user;
};

const toggleAccountStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  user.accountStatus = user.accountStatus === "Active" ? "Inactive" : "Active";
  await user.save();
  return user;
};

const deleteStudent = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  await Application.deleteMany({ studentId: userId });
  await User.findByIdAndDelete(userId);
  return user;
};

module.exports = {
  getDashboardStats, getAllStudents, getPendingStudents,
  approveStudent, rejectStudent, toggleAccountStatus, deleteStudent,
};
