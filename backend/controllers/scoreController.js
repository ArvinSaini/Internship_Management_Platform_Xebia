const asyncHandler = require("express-async-handler");
const scoreService = require("../services/scoreService");
const { sendSuccess } = require("../utils/apiResponse");
const { logAction } = require("../middleware/auditMiddleware");

const assignScore = asyncHandler(async (req, res) => {
  const { studentId, applicationId, internshipId, skills, attendance, feedback, taskCompletion } = req.body;
  if (!studentId || !applicationId || !internshipId) {
    res.status(400); throw new Error("studentId, applicationId, and internshipId are required.");
  }
  const score = await scoreService.assignScore({
    studentId, applicationId, internshipId,
    skills: Number(skills), attendance: Number(attendance),
    feedback: Number(feedback), taskCompletion: Number(taskCompletion),
    adminId: req.user._id,
  });
  await logAction(req, "ASSIGN_SCORE", studentId, `Score: ${score.totalScore}, Grade: ${score.grade}`);
  sendSuccess(res, 200, "Score assigned.", score);
});

const getAllScores = asyncHandler(async (req, res) => {
  const scores = await scoreService.getAllScores();
  sendSuccess(res, 200, "Scores fetched.", scores);
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await scoreService.getLeaderboard();
  sendSuccess(res, 200, "Leaderboard fetched.", leaderboard);
});

const getMyScore = asyncHandler(async (req, res) => {
  const scores = await scoreService.getMyScore(req.user._id);
  sendSuccess(res, 200, "My scores fetched.", scores);
});

const getScoreByApplication = asyncHandler(async (req, res) => {
  const score = await scoreService.getScoreByApplication(req.params.applicationId);
  sendSuccess(res, 200, "Score fetched.", score);
});

module.exports = { assignScore, getAllScores, getLeaderboard, getMyScore, getScoreByApplication };
