const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");

const {} = require("../controllers/productsController");

const adminOnly = [verifyToken, allowedTo("admin", "product manager")];

router.post("/");

router.get("/", adminOnly, getAllUsers);
router.get("/:id", adminOnly, getSingleUser);

router.patch("/:id", adminOnly, updateUser);
router.delete("/:id", adminOnly, deleteUser);
module.exports = router;
