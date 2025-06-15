const asyncWrapper = require("../middleware/asyncWrapper");
const CategoryModel = require("../models/Category.model");
const AppError = require("../utils/appError");
const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const { default: mongoose } = require("mongoose");
const fs = require("node:fs");
const path = require("path");
// add new category

const AddCategory = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "product manager" && req.user.role !== "admin") {
    return next(new AppError("Unauthorized", 401, FAIL));
  }

  const { name, createdBy } = req.body;
  const image = req.file ? req.file.filename : "category.webp";

  const category = new CategoryModel({
    name,
    image,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });
  await category.save();

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    category.image
  }`;

  res.status(200).json({
    status: SUCCESS,
    data: {
      ...category.toObject(),
      image: imageUrl,
    },
  });
});

const getSingleCategory = asyncWrapper(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404, FAIL));
  }

  res.status(200).json({
    status: SUCCESS,
    data: { category },
  });
});

// get all categories

const getAllCategoryes = asyncWrapper(async (req, res, next) => {
  const categories = await CategoryModel.find()
    .populate("createdBy", "name email")
    .lean();

  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  const categoriesWithImages = categories.map((category) => ({
    ...category,
    image: category.image
      ? `${baseUrl}${category.image}`
      : `${baseUrl}category.webp`,
  }));

  res.status(200).json({
    status: SUCCESS,
    data: categoriesWithImages,
  });
});
// update category

const UpdateCategory = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "product manager" && req.user.role !== "admin") {
    return next(new AppError("Unauthorized", 401, FAIL));
  }

  const categoryId = req.params.id;
  const { name, createdBy } = req.body;

  const oldCategory = await CategoryModel.findById(categoryId);
  if (!oldCategory) {
    return next(new AppError("Category not found", 404, FAIL));
  }

  const newImage = req.file ? req.file.filename : oldCategory.image;

  if (req.file && oldCategory.image !== "category.webp") {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      oldCategory.image
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    categoryId,
    {
      name,
      image: newImage,
      createdBy: new mongoose.Types.ObjectId(createdBy),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    updatedCategory.image
  }`;

  res.status(200).json({
    status: SUCCESS,
    data: {
      ...updatedCategory.toObject(),
      image: imageUrl,
    },
  });
});

const deleteCategory = asyncWrapper(async (req, res, next) => {
  const category = await CategoryModel.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404, FAIL));
  }

  const fileName = category.image;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  try {
    if (fs.existsSync(filePath) && fileName !== "category.webp") {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }

  res.status(200).json({
    status: SUCCESS,
    message: "Category deleted successfully",
  });
});
module.exports = {
  AddCategory,
  getAllCategoryes,
  UpdateCategory,
  deleteCategory,
  getSingleCategory,
};
