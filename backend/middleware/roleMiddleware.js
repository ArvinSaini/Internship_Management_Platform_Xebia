const isAdmin = (req, res, next) => {
  if (req.user?.role === "Admin") return next();
  res.status(403); throw new Error("Access denied. Admins only.");
};

const isStudent = (req, res, next) => {
  if (req.user?.role === "Student") return next();
  res.status(403); throw new Error("Access denied. Students only.");
};

module.exports = { isAdmin, isStudent };
