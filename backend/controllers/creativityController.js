const Creativity = require("../models/Creativity");
const deleteFile = require("../utils/deleteFile");
const { uploadBuffer, isConfigured } = require("../utils/cloudinary");

const getCreativity = async (req, res) => {
  try {
    const items = await Creativity.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCreativity = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      if (!isConfigured()) {
        return res
          .status(500)
          .json({ message: "Cloudinary is not configured" });
      }
      const upload = await uploadBuffer(req.file.buffer, {
        folder: "portfolio/creativity",
      });
      data.image = upload.secure_url;
    }

    const item = await Creativity.create(data);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCreativity = async (req, res) => {
  try {
    const item = await Creativity.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const data = { ...req.body };
    if (req.file) {
      if (!isConfigured()) {
        return res
          .status(500)
          .json({ message: "Cloudinary is not configured" });
      }
      // Delete old image before replacing
      await deleteFile(item.image);
      const upload = await uploadBuffer(req.file.buffer, {
        folder: "portfolio/creativity",
      });
      data.image = upload.secure_url;
    }

    Object.assign(item, data);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCreativity = async (req, res) => {
  try {
    const item = await Creativity.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Delete the associated image file from disk
    await deleteFile(item.image);

    await item.deleteOne();
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCreativity,
  createCreativity,
  updateCreativity,
  deleteCreativity,
};
