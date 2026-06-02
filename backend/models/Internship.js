const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ["Remote", "Onsite", "Hybrid"], default: "Remote" },
    duration: { type: String, required: true }, // e.g. "3 months"
    stipend: { type: Number, default: 0 },       // monthly in INR
    skills: [{ type: String }],
    openings: { type: Number, default: 1 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
