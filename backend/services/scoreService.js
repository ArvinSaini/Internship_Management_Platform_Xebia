const InternshipScore = require("../models/InternshipScore");
const User = require("../models/User");

/**
 * Assign or update score for a student's completed internship.
 */
const assignScore = async ({ studentId, applicationId, internshipId, skills, attendance, feedback, taskCompletion, adminId }) => {
  let score = await InternshipScore.findOne({ applicationId });

  if (score) {
    score.skills = skills;
    score.attendance = attendance;
    score.feedback = feedback;
    score.taskCompletion = taskCompletion;
    score.updatedBy = adminId;
    await score.save();
  } else {
    score = await InternshipScore.create({
      studentId, applicationId, internshipId,
      skills, attendance, feedback, taskCompletion,
      updatedBy: adminId,
    });
  }

  return score;
};

/**
 * Get score for a specific student application.
 */
const getScoreByApplication = async (applicationId) => {
  return await InternshipScore.findOne({ applicationId })
    .populate("studentId", "name email profilePicture")
    .populate("internshipId", "title company");
};

/**
 * Get all scores for the leaderboard — ranked by totalScore.
 */
const getLeaderboard = async () => {
  return await InternshipScore.find()
    .populate("studentId", "name email profilePicture")
    .populate("internshipId", "title company")
    .sort({ totalScore: -1 })
    .limit(50);
};

/**
 * Get all scores assigned to students (admin view).
 */
const getAllScores = async () => {
  return await InternshipScore.find()
    .populate("studentId", "name email profilePicture")
    .populate("internshipId", "title company")
    .populate("updatedBy", "name")
    .sort({ totalScore: -1 });
};

/**
 * Get the score for the current logged-in student.
 */
const getMyScore = async (studentId) => {
  return await InternshipScore.find({ studentId })
    .populate("internshipId", "title company duration")
    .sort({ createdAt: -1 });
};

module.exports = { assignScore, getScoreByApplication, getLeaderboard, getAllScores, getMyScore };
