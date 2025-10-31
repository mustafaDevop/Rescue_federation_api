

// Role-based authorization
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role === requiredRole) {
      return next();
    }

    return res.status(403).json({ message: "Access denied: Role mismatch" });
  };
};

module.exports = {
  permit: authorizePermission,
  admit: authorizeRole,
};
