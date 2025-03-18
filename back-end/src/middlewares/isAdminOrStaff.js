const isAdminOrStaff = (req, res, next) => {
  if (req.user.role === "ADMIN" || req.user.role === "STAFF") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied, Admin or Staff only" });
  }
};

export default isAdminOrStaff;
