const asyncWrapper = require("../middleware/asyncWrapper");
const CategoryModel = require("../models/Category.model");
const AppError = require("../utils/appError");
const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const { default: mongoose } = require("mongoose");

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
  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCategory) {
    return next(new AppError("category not found", 404, FAIL));
  }

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

module.exports = { AddCategory, getAllCategoryes, UpdateCategory };
