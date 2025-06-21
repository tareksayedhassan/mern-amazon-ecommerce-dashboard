const { default: mongoose } = require("mongoose");
const asyncWrapper = require("../middleware/asyncWrapper");
const ProductModel = require("../models/Product.model");
const AppError = require("../utils/appError");
const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const path = require("path");
const fs = require("fs");
const CategoryModel = require("../models/Category.model");
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
    category: category ? new mongoose.Types.ObjectId(category) : null,
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

const getSingleProduct = asyncWrapper(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  const product = await ProductModel.findById(req.params.id).lean();
  if (!product) {
    return next(new AppError("product not found", 404, FAIL));
  }

  const productWithImage = {
    ...product,
    image: Array.isArray(product.image)
      ? product.image.map((img) => `${baseUrl}${img}`)
      : [`${baseUrl}${product.image}`],
  };

  res.status(200).json({
    status: SUCCESS,
    data: productWithImage,
  });
});

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10, search = "", category } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  const searchQuery = {};

  if (search) {
    searchQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { about: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    const categoryDoc = await CategoryModel.findOne({ name: category });
    if (categoryDoc) {
      searchQuery.category = categoryDoc._id;
    }
  }

  const total = await ProductModel.countDocuments(searchQuery);

  const products = await ProductModel.find(searchQuery, { __v: 0 })
    .limit(parseInt(limit))
    .skip(skip)
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
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit),
    count: productsWithImage.length,
    data: productsWithImage,
  });
});

const editPrducts = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "product manager" && req.user.role !== "admin") {
    return next(new AppError("Unauthorized", 401, FAIL));
  }

  const productId = req.params.id;

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

  const createdBy = new mongoose.Types.ObjectId(req.user.id);

  const oldProduct = await ProductModel.findById(productId);
  if (!oldProduct) {
    return next(new AppError("Product not found", 404, FAIL));
  }

  const newImage =
    req.files && req.files.length > 0
      ? req.files.map((file) => file.filename)
      : oldProduct.image;

  if (req.file && oldProduct.image !== "category.webp") {
    const oldImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      oldProduct.image
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  const editProduct = await ProductModel.findByIdAndUpdate(
    productId,
    {
      title,
      price,
      description,
      category,
      rating,
      ratings_number,
      discount,
      about,
      status,
      image: newImage,
      createdBy,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    editProduct.image
  }`;

  res.status(200).json({
    status: SUCCESS,
    data: {
      ...editProduct.toObject(),
      image: imageUrl,
    },
  });
});

const deleteProducts = asyncWrapper(async (req, res, next) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("product not found", 404, FAIL));
  }

  try {
    if (Array.isArray(product.image)) {
      product.image.forEach((fileName) => {
        if (fileName !== "category.webp") {
          const filePath = path.join(__dirname, "..", "uploads", fileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    } else if (product.image !== "category.webp") {
      const filePath = path.join(__dirname, "..", "uploads", product.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }

  res.status(200).json({
    status: SUCCESS,
    message: "product deleted successfully",
  });
});

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  deleteProducts,
  editPrducts,
};
