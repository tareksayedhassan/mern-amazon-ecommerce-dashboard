const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    const error = new AppError("token is required", 401, httpStatusText.ERROR);
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    console.log("Token received:", token);

    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = currentUser;
    next();
  } catch (err) {
    const error = new AppError("invalid token", 401, httpStatusText.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
