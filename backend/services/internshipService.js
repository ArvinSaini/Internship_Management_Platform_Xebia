const Internship = require("../models/Internship");

const getAllInternships = async ({ search, type, status }) => {
  const query = {};
  if (status) query.status = status;
  else query.status = "Active";
  if (type) query.type = type;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
    ];
  }
  return await Internship.find(query).populate("postedBy", "name").sort({ createdAt: -1 });
};

const getInternshipById = async (id) => {
  const internship = await Internship.findById(id).populate("postedBy", "name email");
  if (!internship) throw new Error("Internship not found.");
  return internship;
};

const createInternship = async (data, adminId) => {
  return await Internship.create({ ...data, postedBy: adminId });
};

const updateInternship = async (id, data) => {
  const internship = await Internship.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!internship) throw new Error("Internship not found.");
  return internship;
};

const deleteInternship = async (id) => {
  const internship = await Internship.findByIdAndDelete(id);
  if (!internship) throw new Error("Internship not found.");
  return internship;
};

const toggleInternshipStatus = async (id) => {
  const internship = await Internship.findById(id);
  if (!internship) throw new Error("Internship not found.");
  internship.status = internship.status === "Active" ? "Closed" : "Active";
  await internship.save();
  return internship;
};

module.exports = {
  getAllInternships, getInternshipById, createInternship,
  updateInternship, deleteInternship, toggleInternshipStatus,
};
