const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");

const {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const adminOnly = [verifyToken, allowedTo("admin")];

router.get("/", adminOnly, getAllUsers);
router.get("/:id", adminOnly, getSingleUser);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name field is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
    ...adminOnly,
  ],
  addUser
);
router.patch("/:id", adminOnly, updateUser);
router.delete("/:id", adminOnly, deleteUser);
module.exports = router;
