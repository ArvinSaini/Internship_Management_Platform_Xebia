const asyncHandler = require("express-async-handler");
const adminService = require("../services/adminService");
const { sendSuccess } = require("../utils/apiResponse");
const { logAction } = require("../middleware/auditMiddleware");

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  sendSuccess(res, 200, "Stats fetched.", stats);
});

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await adminService.getAllStudents(req.query.search);
  sendSuccess(res, 200, "Students fetched.", students);
});

const getPendingStudents = asyncHandler(async (req, res) => {
  const students = await adminService.getPendingStudents();
  sendSuccess(res, 200, "Pending students fetched.", students);
});

const approveStudent = asyncHandler(async (req, res) => {
  const user = await adminService.approveStudent(req.params.id);
  await logAction(req, "APPROVE_STUDENT", user._id, `Approved: ${user.email}`);
  sendSuccess(res, 200, "Student approved.", user);
});

const rejectStudent = asyncHandler(async (req, res) => {
  const user = await adminService.rejectStudent(req.params.id);
  await logAction(req, "REJECT_STUDENT", user._id, `Rejected: ${user.email}`);
  sendSuccess(res, 200, "Student rejected.", user);
});

const toggleAccountStatus = asyncHandler(async (req, res) => {
  const user = await adminService.toggleAccountStatus(req.params.id);
  await logAction(req, `${user.accountStatus === "Active" ? "ACTIVATE" : "DEACTIVATE"}_USER`, user._id, user.email);
  sendSuccess(res, 200, `Account ${user.accountStatus}.`, user);
});

const deleteStudent = asyncHandler(async (req, res) => {
  const user = await adminService.deleteStudent(req.params.id);
  await logAction(req, "DELETE_STUDENT", null, `Deleted: ${user.email}`);
  sendSuccess(res, 200, "Student deleted.");
});

module.exports = {
  getDashboardStats, getAllStudents, getPendingStudents,
  approveStudent, rejectStudent, toggleAccountStatus, deleteStudent,
};
