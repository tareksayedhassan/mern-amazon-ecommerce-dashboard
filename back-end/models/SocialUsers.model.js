const mongoose = require("mongoose");
const validator = require("validator");

const SocialUsers = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        // Password مطلوب لو مفيش googleId (يعني تسجيل عادي)
        return !this.googleId;
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // يسمح بعدم وجود googleId عند تسجيل المستخدم بالباسورد فقط
    },

    token: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "superAdmin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    collection: "socialuser",
  }
);

module.exports = mongoose.model("socialuser", SocialUsers);
