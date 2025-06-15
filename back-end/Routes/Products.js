const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const multer = require("multer");

const {
  addProduct,
  getAllProducts,
} = require("../controllers/ProductController");

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

router.post("/", adminOnly, upload.array("image", 10), addProduct);

router.get("/", adminOnly, getAllProducts);

// router.delete("/:id", adminOnly);

// router.patch("/:id", upload.single("image"), adminOnly);
// router.get("/:id", upload.single("image"), adminOnly);

module.exports = router;
