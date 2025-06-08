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
    const error = new AppError(
      "Password and confirm password do not match",
      400,
      FAIL
    );
    return next(error);
  }

  const oldUser = await usersModel.findOne({ email });
  if (oldUser) {
    const error = new AppError("User already exists", 400, FAIL);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = usersModel({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = await generateJWT({
    email: newUser.email,
    id: newUser.id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();

  res.status(201).json({
    status: SUCCESS,
    message: "User registered successfully",
    code: 201,
    data: newUser,
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new AppError("email and password are required", 400, FAIL);
    return next(error);
  }

  const user = await usersModel.findOne({ email: email });
  if (!user) {
    const error = new AppError("user not exists", 404, ERROR);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    return res.status(200).json({
      status: SUCCESS,
      message: "User Logged successfully",
      data: { token },
    });
  } else {
    const error = new AppError("something wrong", 500, ERROR);
    return next(error);
  }
});

const googleLogin = asyncWrapper(async (req, res, next) => {});
module.exports = {
  register,
  login,
  googleLogin,
};
