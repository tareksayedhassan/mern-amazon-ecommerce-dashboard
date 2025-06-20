const asyncWrapper = require("../middleware/asyncWrapper");
const BrandModel = require("../models/Brand.model");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const { FAIL } = require("../utils/httpStatusText");
const path = require("path");
const fs = require("fs");

const addBrand = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "product manager") {
    return next(new AppError("Unauthorized", 401, FAIL));
  }

  const { name, agent, country, status, verified } = req.body;

  const image =
    req.file && req.file.filename ? req.file.filename : "category.webp";

  const brand = new BrandModel({
    name,
    agent,
    logo: image,
    country,
    status,
    verified,
    createdBy: new mongoose.Types.ObjectId(req.user.id),
  });

  await brand.save();

  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  const brandWithFullLogoPath = {
    ...brand.toObject(),
    logo: `${baseUrl}${brand.logo}`,
  };

  res.status(200).json({
    status: "SUCCESS",
    data: brandWithFullLogoPath,
  });
});

const getAllBrands = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 5, search = "" } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  const searchQuery = search ? { name: { $regex: search, $options: "i" } } : {};

  const total = await BrandModel.countDocuments(searchQuery);

  const brands = await BrandModel.find(searchQuery, { __v: 0 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("createdBy")
    .lean();

  const brandsWithFullLogo = brands.map((brand) => {
    const cleanedLogo = brand.logo?.replace(/^uploads\/uploads/, "uploads");
    return {
      ...brand,
      logo: `${baseUrl}${cleanedLogo || "category.webp"}`,
    };
  });

  res.status(200).json({
    status: "SUCCESS",
    page: Number(page),
    limit: Number(limit),
    total,
    data: brandsWithFullLogo,
  });
});

const editBrand = asyncWrapper(async (req, res, next) => {
  if (req.user.role !== "product manager" && req.user.role !== "admin") {
    return next(new AppError("Unauthorized", 401, FAIL));
  }

  const brandId = req.params.id;
  const { name, agent, country, status, verified } = req.body;

  const oldBrand = await BrandModel.findById(brandId);
  if (!oldBrand) {
    return next(new AppError("Brand not found", 404, FAIL));
  }

  let logo = oldBrand.logo;

  if (req.file && req.file.filename) {
    const newLogo = req.file.filename;

    if (oldBrand.logo !== "category.webp") {
      const oldImagePath = path.join(__dirname, "..", "uploads", oldBrand.logo);
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    logo = newLogo;
  }

  const updatedBrand = await BrandModel.findByIdAndUpdate(
    brandId,
    {
      name,
      agent,
      logo,
      country,
      status,
      verified,
      createdBy: new mongoose.Types.ObjectId(req.user.id),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    updatedBrand.logo
  }`;

  res.status(200).json({
    status: "SUCCESS",
    data: {
      ...updatedBrand.toObject(),
      logo: imageUrl,
    },
  });
});

const deleteBrand = asyncWrapper(async (req, res, next) => {
  const brand = await BrandModel.findByIdAndDelete(req.params.id);
  if (!brand) {
    return next(new AppError("Brand not Found", 404, FAIL));
  }

  try {
    if (brand.logo !== "category.webp") {
      const filePath = path.join(__dirname, "..", "uploads", brand.logo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "Brand deleted successfully",
  });
});

const getSingleBrand = asyncWrapper(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  const brand = await BrandModel.findById(req.params.id).lean();
  if (!brand) {
    return next(new AppError("Brand Not Found", 404, FAIL));
  }

  const brandWithLogo = {
    ...brand,
    logo: `${baseUrl}${brand.logo}`,
  };

  res.status(200).json({
    status: "SUCCESS",
    data: brandWithLogo,
  });
});

module.exports = {
  addBrand,
  getAllBrands,
  getSingleBrand,
  deleteBrand,
  editBrand,
};
