const ContactInfo = require("../models/ContactInfo");

// @desc    Get contact info
// @route   GET /api/contact-info
// @access  Public
const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    if (!contactInfo) {
      // Return default values if no document exists yet
      return res.status(200).json({
        email: "anjana.arakerimath@pccoepune.org",
        emailSubtext: "I usually reply within 24 hours.",
        location: "Bangalore, India",
        locationSubtext: "Available for remote collaborations worldwide.",
        phone: "+91 9876543210",
        phoneSubtext: "For urgent queries only",
        socialLinks: {
          github: "#",
          linkedin: "#",
          twitter: "#",
        },
      });
    }
    res.status(200).json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update contact info
// @route   PUT /api/contact-info
// @access  Private (Admin)
const updateContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();

    if (contactInfo) {
      // Update existing document
      contactInfo.email = req.body.email || contactInfo.email;
      contactInfo.emailSubtext =
        req.body.emailSubtext || contactInfo.emailSubtext;
      contactInfo.location = req.body.location || contactInfo.location;
      contactInfo.locationSubtext =
        req.body.locationSubtext || contactInfo.locationSubtext;
      contactInfo.phone = req.body.phone || contactInfo.phone;
      contactInfo.phoneSubtext =
        req.body.phoneSubtext || contactInfo.phoneSubtext;

      if (req.body.socialLinks) {
        contactInfo.socialLinks.github =
          req.body.socialLinks.github !== undefined
            ? req.body.socialLinks.github
            : contactInfo.socialLinks.github;
        contactInfo.socialLinks.linkedin =
          req.body.socialLinks.linkedin !== undefined
            ? req.body.socialLinks.linkedin
            : contactInfo.socialLinks.linkedin;
        contactInfo.socialLinks.twitter =
          req.body.socialLinks.twitter !== undefined
            ? req.body.socialLinks.twitter
            : contactInfo.socialLinks.twitter;
      }

      const updatedContactInfo = await contactInfo.save();
      res.status(200).json(updatedContactInfo);
    } else {
      // Create new document if none exists
      contactInfo = await ContactInfo.create({
        email: req.body.email,
        emailSubtext: req.body.emailSubtext,
        location: req.body.location,
        locationSubtext: req.body.locationSubtext,
        phone: req.body.phone,
        phoneSubtext: req.body.phoneSubtext,
        socialLinks: req.body.socialLinks || {
          github: "",
          linkedin: "",
          twitter: "",
        },
      });
      res.status(201).json(contactInfo);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo,
};
