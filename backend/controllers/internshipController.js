const asyncHandler = require("express-async-handler");
const internshipService = require("../services/internshipService");
const { sendSuccess } = require("../utils/apiResponse");
const { logAction } = require("../middleware/auditMiddleware");

const getAllInternships = asyncHandler(async (req, res) => {
  const { search, type, status } = req.query;
  const internships = await internshipService.getAllInternships({ search, type, status });
  sendSuccess(res, 200, "Internships fetched.", internships);
});

const getInternshipById = asyncHandler(async (req, res) => {
  const internship = await internshipService.getInternshipById(req.params.id);
  sendSuccess(res, 200, "Internship fetched.", internship);
});

const createInternship = asyncHandler(async (req, res) => {
  const internship = await internshipService.createInternship(req.body, req.user._id);
  await logAction(req, "CREATE_INTERNSHIP", null, `Created: ${internship.title}`);
  sendSuccess(res, 201, "Internship created.", internship);
});

const updateInternship = asyncHandler(async (req, res) => {
  const internship = await internshipService.updateInternship(req.params.id, req.body);
  await logAction(req, "UPDATE_INTERNSHIP", null, `Updated: ${internship.title}`);
  sendSuccess(res, 200, "Internship updated.", internship);
});

const deleteInternship = asyncHandler(async (req, res) => {
  const internship = await internshipService.deleteInternship(req.params.id);
  await logAction(req, "DELETE_INTERNSHIP", null, `Deleted: ${internship.title}`);
  sendSuccess(res, 200, "Internship deleted.");
});

const toggleInternshipStatus = asyncHandler(async (req, res) => {
  const internship = await internshipService.toggleInternshipStatus(req.params.id);
  await logAction(req, "TOGGLE_INTERNSHIP_STATUS", null, `${internship.title} → ${internship.status}`);
  sendSuccess(res, 200, `Internship ${internship.status}.`, internship);
});

module.exports = {
  getAllInternships, getInternshipById, createInternship,
  updateInternship, deleteInternship, toggleInternshipStatus,
};
