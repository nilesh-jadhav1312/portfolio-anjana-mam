const mongoose = require("mongoose");

const contactInfoSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    emailSubtext: { type: String, default: "I usually reply within 24 hours." },
    location: { type: String, required: true },
    locationSubtext: {
      type: String,
      default: "Available for remote collaborations worldwide.",
    },
    phone: { type: String, required: true },
    phoneSubtext: { type: String, default: "For urgent queries only" },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      googleScholar: { type: String, default: "" },
      gmail: { type: String, default: "" },
    },
    officeName: { type: String, default: "" },
    officeMapLink: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
