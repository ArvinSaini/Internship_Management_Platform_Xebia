const Application = require("../models/Application");
const Internship = require("../models/Internship");
const Notification = require("../models/Notification");

const applyToInternship = async (studentId, internshipId, coverLetter) => {
  const internship = await Internship.findById(internshipId);
  if (!internship) throw new Error("Internship not found.");
  if (internship.status === "Closed") throw new Error("This internship is no longer accepting applications.");

  const existing = await Application.findOne({ studentId, internshipId });
  if (existing) throw new Error("You have already applied to this internship.");

  const application = await Application.create({ studentId, internshipId, coverLetter });

  // Notify student
  await Notification.create({
    userId: studentId,
    title: "Application Submitted",
    message: `Your application for "${internship.title}" at ${internship.company} has been submitted successfully.`,
    type: "success",
  });

  return application;
};

const getMyApplications = async (studentId) => {
  return await Application.find({ studentId })
    .populate("internshipId", "title company location type stipend duration status")
    .sort({ createdAt: -1 });
};

const getAllApplications = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.internshipId) query.internshipId = filters.internshipId;
  return await Application.find(query)
    .populate("studentId", "name email phone profilePicture skills")
    .populate("internshipId", "title company")
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 });
};

const updateApplicationStatus = async (applicationId, status, adminId, remarks = "") => {
  const application = await Application.findById(applicationId).populate("studentId internshipId");
  if (!application) throw new Error("Application not found.");

  application.status = status;
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();
  application.remarks = remarks;
  await application.save();

  // Notify the student
  const messages = {
    "Under Review": `Your application for "${application.internshipId.title}" is now under review.`,
    "Selected": `🎉 Congratulations! You've been selected for "${application.internshipId.title}" at ${application.internshipId.company}.`,
    "Rejected": `Your application for "${application.internshipId.title}" was not selected.${remarks ? ` Reason: ${remarks}` : ""}`,
    "Completed": `Your internship at "${application.internshipId.company}" has been marked as completed!`,
  };

  if (messages[status]) {
    await Notification.create({
      userId: application.studentId._id,
      title: `Application ${status}`,
      message: messages[status],
      type: status === "Rejected" ? "error" : "success",
    });
  }

  return application;
};

module.exports = { applyToInternship, getMyApplications, getAllApplications, updateApplicationStatus };
