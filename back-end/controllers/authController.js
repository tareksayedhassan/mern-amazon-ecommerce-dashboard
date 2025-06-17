const asyncWrapper = require("../middleware/asyncWrapper");
const usersModel = require("../models/Users.model");
const AppError = require("../utils/appError");
const { SUCCESS, FAIL, ERROR } = require("../utils/httpStatusText");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const session = require("express-session");
const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return next(
      new AppError("Password and confirm password do not match", 400, FAIL)
    );
  }

  const oldUser = await usersModel.findOne({ email });
  if (oldUser) {
    return next(new AppError("User already exists", 400, FAIL));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new usersModel({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const { token, refreshToken } = await generateJWT({
    email: newUser.email,
    id: newUser.id,
    role: newUser.role,
  });

  newUser.token = token;
  newUser.refreshToken = refreshToken;

  await newUser.save();

  res.status(201).json({
    status: SUCCESS,
    message: "User registered successfully",
    code: 201,
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
      refreshToken,
    },
  });
});
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("email and password are required", 400, FAIL));
  }

  const user = await usersModel.findOne({ email });
  if (!user) {
    return next(new AppError("user not exists", 404, ERROR));
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    return next(new AppError("invalid credentials", 401, ERROR));
  }

  const { token, refreshToken } = await generateJWT({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  user.token = token;
  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    status: SUCCESS,
    message: "User Logged successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});

const refreshTokenHandler = asyncWrapper(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError("Refresh token is required", 400, "FAIL"));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    const { token, refreshToken: newRefreshToken } = await generateJWT({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "Access token refreshed",
      accessToken: token,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return next(new AppError("Invalid or expired refresh token", 403, "FAIL"));
  }
});
module.exports = refreshTokenHandler;

module.exports = {
  register,
  login,
  refreshTokenHandler,
};
