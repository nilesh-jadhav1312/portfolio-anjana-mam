const Gallery = require("../models/Gallery");
const deleteFile = require("../utils/deleteFile");
const { uploadBuffer, isConfigured } = require("../utils/cloudinary");

const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGallery = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      if (!isConfigured()) {
        return res
          .status(500)
          .json({ message: "Cloudinary is not configured" });
      }
      const upload = await uploadBuffer(req.file.buffer, {
        folder: "portfolio/gallery",
      });
      data.image = upload.secure_url;
    }

    const item = await Gallery.create(data);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGallery = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      if (!isConfigured()) {
        return res
          .status(500)
          .json({ message: "Cloudinary is not configured" });
      }
      await deleteFile(item.image);
      const upload = await uploadBuffer(req.file.buffer, {
        folder: "portfolio/gallery",
      });
      item.image = upload.secure_url;
    }

    Object.assign(item, req.body);

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    await deleteFile(item.image);

    await item.deleteOne();
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGallery, createGallery, updateGallery, deleteGallery };
