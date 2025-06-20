const mongoose = require("mongoose");

const brandModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    logo: { type: String },
    status: {
      type: String,
      enum: ["unqualified", "qualified", "new", "negotiation", "renewal"],
    },
    verified: { type: Boolean },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("brand", brandModel);
