const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema(
  {
    image: { type: String, required: true },
    date: { type: String, required: true },
    caption: { type: String },
    category: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Gallery", gallerySchema);
