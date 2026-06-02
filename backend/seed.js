require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@internship.com" });
    if (existing) {
      console.log("ℹ️  Admin already exists. Skipping seed.");
      process.exit(0);
    }

    await User.create({
      name: "Super Admin",
      email: "admin@internship.com",
      phone: "9000000000",
      password: "Admin@123",
      role: "Admin",
      approvalStatus: "Approved",
      accountStatus: "Active",
    });

    console.log("✅ Default admin created:");
    console.log("   Email    : admin@internship.com");
    console.log("   Password : Admin@123");
    console.log("⚠️  Please change the password after first login!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();
