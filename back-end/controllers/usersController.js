const asyncWrapper = require("../middleware/asyncWrapper");
const usersModel = require("../models/Users.model");
const AppError = require("../utils/appError"); // عدّلنا الاسم هنا
const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const { validationResult } = require("express-validator");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const users = await usersModel.find({}, { __v: 0 }).limit(limit).skip(skip);

  res.json({ status: SUCCESS, data: { users } });
});

const getSingleUser = asyncWrapper(async (req, res, next) => {
  const user = await usersModel.findById(req.params.id);
  if (!user) {
    const error = new AppError("User not found", 404, FAIL);
    return next(error);
  }
  res.status(200).json({ status: SUCCESS, data: { item: user } });
});

const addUser = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError(JSON.stringify(errors.array()), 400, FAIL); // عدّلنا هنا
    return next(error);
  }

  const newUser = new usersModel(req.body);
  await newUser.save();

  res.status(201).json({
    status: SUCCESS,
    data: { user: newUser },
  });
});

const updateUser = asyncWrapper(async (req, res, next) => {
  const updated = await usersModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return res.status(404).json({ status: FAIL, message: "User not found" });
  }

  res.status(200).json({ status: SUCCESS, data: updated });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const data = await usersModel.deleteOne({ _id: req.params.id });
  res.status(200).json({ status: "user deleted successfully", success: true });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
};
