const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Selected", "Rejected", "Completed"],
      default: "Pending",
    },
    coverLetter: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
