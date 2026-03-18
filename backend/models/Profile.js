const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String },
    workExperience: [{ type: String }],
    educationDetails: [{ type: String }],
    professionalMemberships: [{ type: String }],
    cvFile: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
