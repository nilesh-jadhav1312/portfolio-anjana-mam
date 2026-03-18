const mongoose = require("mongoose");

const teachingSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: String, required: true },
    link: { type: String }, // Optional link for more details
  },
  { timestamps: true },
);

module.exports = mongoose.model("Teaching", teachingSchema);
