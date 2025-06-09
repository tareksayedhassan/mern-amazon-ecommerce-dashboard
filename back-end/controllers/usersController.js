const asyncWrapper = require("../middleware/asyncWrapper");
const usersModel = require("../models/Users.model");
const AppError = require("../utils/appError");
const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");

// Get all users with pagination
const getAllUsers = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await usersModel
    .find({}, { __v: 0 })
    .limit(parseInt(limit))
    .skip(skip);

  res.status(200).json({
    status: SUCCESS,
    results: users.length,
    data: { users },
  });
});

// Get single user by ID
const getSingleUser = asyncWrapper(async (req, res, next) => {
  const user = await usersModel.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404, FAIL));
  }

  res.status(200).json({
    status: SUCCESS,
    data: { user },
  });
});

// Add new user
const addUser = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(JSON.stringify(errors.array()), 400, FAIL));
  }

  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = usersModel({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;
  await newUser.save();

  res.status(201).json({
    status: SUCCESS,
    data: { user: newUser },
  });
});

// Update user by ID
const updateUser = asyncWrapper(async (req, res, next) => {
  const updatedUser = await usersModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    return next(new AppError("User not found", 404, FAIL));
  }

  res.status(200).json({
    status: SUCCESS,
    data: { user: updatedUser },
  });
});

// Delete user by ID
const deleteUser = asyncWrapper(async (req, res, next) => {
  const result = await usersModel.findByIdAndDelete(req.params.id);

  if (!result) {
    return next(new AppError("User not found", 404, FAIL));
  }

  res.status(200).json({
    status: SUCCESS,
    message: "User deleted successfully",
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
};
