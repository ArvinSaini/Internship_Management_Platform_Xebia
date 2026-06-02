const asyncHandler = require("express-async-handler");
const applicationService = require("../services/applicationService");
const { sendSuccess } = require("../utils/apiResponse");
const { logAction } = require("../middleware/auditMiddleware");

const applyToInternship = asyncHandler(async (req, res) => {
  const { internshipId, coverLetter } = req.body;
  if (!internshipId) { res.status(400); throw new Error("Internship ID required."); }
  const application = await applicationService.applyToInternship(req.user._id, internshipId, coverLetter);
  sendSuccess(res, 201, "Application submitted.", application);
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getMyApplications(req.user._id);
  sendSuccess(res, 200, "Applications fetched.", applications);
});

const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getAllApplications(req.query);
  sendSuccess(res, 200, "All applications fetched.", applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;
  if (!status) { res.status(400); throw new Error("Status required."); }
  const application = await applicationService.updateApplicationStatus(
    req.params.id, status, req.user._id, remarks
  );
  await logAction(req, `APPLICATION_${status.toUpperCase().replace(" ", "_")}`, application.studentId._id, `Status → ${status}`);
  sendSuccess(res, 200, `Application ${status}.`, application);
});

module.exports = { applyToInternship, getMyApplications, getAllApplications, updateApplicationStatus };
