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
        return !this.googleId;
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    token: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "user", "product manager"],
      default: "user",
    },
  },
  {
    timestamps: true,
    collection: "socialuser",
  }
);

module.exports = mongoose.model("socialuser", SocialUsers);
