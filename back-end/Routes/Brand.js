const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const multer = require("multer");
const AppError = require("../utils/appError");

const {
  addBrand,
  getAllBrands,
  getSingleBrand,
  deleteBrand,
  editBrand,
} = require("../controllers/Brandcontroller");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(new AppError("file must be an image", 400));
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

const adminOnly = [verifyToken, allowedTo("admin", "product manager")];

router.post("/", adminOnly, upload.single("image"), addBrand);
router.get("/", getAllBrands);
router.get("/:id", adminOnly, getSingleBrand);
router.delete("/:id", adminOnly, deleteBrand);
router.patch("/:id", adminOnly, upload.single("image"), editBrand);

module.exports = router;
