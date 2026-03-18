const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, required: true },
    year: { type: String, required: true },
    certificateFile: { type: String }, // Path to the uploaded file
  },
  { timestamps: true },
);

module.exports = mongoose.model("Certificate", certificateSchema);
