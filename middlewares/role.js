module.exports.checkRole = (...allowedRoles) => {
    return (req, res, next) => {
      const role = req.user.role;
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          status: false,
          message: 'Access denied. Wallet is only available to vendors and riders.'
        });
      }
      next();
    };
  };
  

  
  exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: false,
        message: 'Access restricted to vendors only'
      });
    }
    next();
  };