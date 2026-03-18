const mongoose = require("mongoose");

const interactionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true }, // Dynamic Category String
    date: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Interaction", interactionSchema);
