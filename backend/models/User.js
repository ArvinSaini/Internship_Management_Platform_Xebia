const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`
      }
    },
    password: { type: String, required: true, minlength: 6, select: false },
    profilePicture: { type: String, default: "" },
    role: { type: String, enum: ["Student", "Admin"], default: "Student" },
    approvalStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    accountStatus: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    // Student profile fields
    skills: [{ type: String }],
    education: {
      degree: { type: String, default: "" },
      institution: { type: String, default: "" },
      year: { type: String, default: "" },
    },
    resumeUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
