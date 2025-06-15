const { default: mongoose } = require("mongoose");
const asyncWrapper = require("../middleware/asyncWrapper");
const ProductModel = require("../models/Product.model");
const AppError = require("../utils/appError");
const { SUCCESS, FAIL } = require("../utils/httpStatusText");

const addProduct = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "product manager" && req.user.role !== "admin") {
    return next(new AppError("Unauthorized", 401, FAIL));
  }

  const {
    title,
    price,
    description,
    category,
    rating,
    ratings_number,
    discount,
    about,
    status,
  } = req.body;

  const image =
    req.files && req.files.length > 0
      ? req.files.map((file) => file.filename)
      : ["category.webp"];

  const product = new ProductModel({
    title,
    price,
    description,
    category,
    rating,
    ratings_number,
    discount,
    about,
    status,
    image,
    createdBy: new mongoose.Types.ObjectId(req.user.id),
  });

  await product.save();

  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
  const productWithFullImagePaths = {
    ...product.toObject(),
    image: product.image.map((img) => `${baseUrl}${img}`),
  };

  res.status(200).json({
    status: SUCCESS,
    data: productWithFullImagePaths,
  });
});

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  const products = await ProductModel.find()
    .populate("category", "name")
    .lean();

  const productsWithImage = products.map((pro) => ({
    ...pro,
    image: Array.isArray(pro.image)
      ? pro.image.map((img) => `${baseUrl}${img}`)
      : [`${baseUrl}${pro.image}`],
  }));

  res.status(200).json({
    status: SUCCESS,
    data: productsWithImage,
  });
});

module.exports = {
  addProduct,
  getAllProducts,
};
