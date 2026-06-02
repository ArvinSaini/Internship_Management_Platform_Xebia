const mongoose = require("mongoose");

const internshipScoreSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },
    // Individual score components (0–100)
    skills: { type: Number, min: 0, max: 100, default: 0 },
    attendance: { type: Number, min: 0, max: 100, default: 0 },
    taskCompletion: { type: Number, min: 0, max: 100, default: 0 },
    feedback: { type: Number, min: 0, max: 100, default: 0 },
    // Weighted total score (auto-calculated before save)
    totalScore: { type: Number, default: 0 },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Auto-calculate totalScore as weighted average before saving
internshipScoreSchema.pre("save", function (next) {
  this.totalScore = Math.round(
    this.skills * 0.3 +
    this.attendance * 0.2 +
    this.taskCompletion * 0.3 +
    this.feedback * 0.2
  );
  next();
});

module.exports = mongoose.model("InternshipScore", internshipScoreSchema);
