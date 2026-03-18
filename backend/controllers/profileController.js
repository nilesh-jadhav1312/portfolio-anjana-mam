const Profile = require("../models/Profile");
const deleteFile = require("../utils/deleteFile");
const { uploadBuffer, isConfigured } = require("../utils/cloudinary");

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = new Profile(req.body);
    } else {
      // Update fields manually if they exist
      if (req.body.name) profile.name = req.body.name;
      if (req.body.subtitle) profile.subtitle = req.body.subtitle;
      if (req.body.bio) profile.bio = req.body.bio;
    }

    if (req.files) {
      if (!isConfigured()) {
        return res
          .status(500)
          .json({ message: "Cloudinary is not configured" });
      }
      if (req.files.profileImage) {
        await deleteFile(profile.profileImage);
        const upload = await uploadBuffer(req.files.profileImage[0].buffer, {
          folder: "portfolio/profile",
        });
        profile.profileImage = upload.secure_url;
      }
    }

    if (typeof req.body.cvFile === "string") {
      profile.cvFile = req.body.cvFile;
    }

    if (
      req.body.workExperience &&
      typeof req.body.workExperience === "string"
    ) {
      try {
        profile.workExperience = JSON.parse(req.body.workExperience);
      } catch (e) {}
    }

    if (
      req.body.educationDetails &&
      typeof req.body.educationDetails === "string"
    ) {
      try {
        profile.educationDetails = JSON.parse(req.body.educationDetails);
      } catch (e) {}
    }

    if (
      req.body.professionalMemberships &&
      typeof req.body.professionalMemberships === "string"
    ) {
      try {
        profile.professionalMemberships = JSON.parse(
          req.body.professionalMemberships,
        );
      } catch (e) {}
    }

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
