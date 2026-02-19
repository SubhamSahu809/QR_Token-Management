const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  maxCount: {
    type: Number,
    required: true,
    min: 1,
  },
  remainingCount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Token", tokenSchema);

