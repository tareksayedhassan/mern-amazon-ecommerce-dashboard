const AppError = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (
      req.user.role === "writer" &&
      req.params.id &&
      req.params.id === req.user.id
    ) {
      return next();
    }
    if (
      req.user.role === "product manager" &&
      req.params.id &&
      req.params.id === req.user.id
    ) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`This role is not authorized -> ${req.user.role}`, 401)
      );
    }

    next();
  };
};
