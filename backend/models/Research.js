const mongoose = require("mongoose");

const researchSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    year: { type: String, required: true },
    tags: [{ type: String }],
    pdfFile: { type: String },
    link: { type: String }, // New optional visit link
  },
  { timestamps: true },
);

module.exports = mongoose.model("Research", researchSchema);
