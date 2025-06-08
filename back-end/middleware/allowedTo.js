const AppError = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(`this role is not authorized ->${req.user.role}`, 401)
      );
    }
    next();
  };
};
