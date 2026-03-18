const Research = require("../models/Research");
const deleteFile = require("../utils/deleteFile");
const { uploadBuffer, isConfigured } = require("../utils/cloudinary");

const getResearch = async (req, res) => {
  try {
    const research = await Research.find().sort({ year: -1 });
    res.json(research);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a research item
// @route   POST /api/research
// @access  Private (Admin)
const createResearch = async (req, res) => {
  try {
    const { title, abstract, year, tags, link } = req.body;
    let pdfFile = null;

    if (req.file) {
      if (!isConfigured()) {
        return res
          .status(500)
          .json({ message: "Cloudinary is not configured" });
      }
      const upload = await uploadBuffer(req.file.buffer, {
        folder: "portfolio/research",
        resource_type: "raw",
        use_filename: true,
        unique_filename: false,
      });
      pdfFile = upload.secure_url;
    }

    // Parse comma-separated tags
    const tagsArray = tags ? tags.split(",").map((t) => t.trim()) : [];

    const research = await Research.create({
      title,
      abstract,
      year,
      tags: tagsArray,
      pdfFile,
      link,
    });
    res.status(201).json(research);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a research item
// @route   PUT /api/research/:id
// @access  Private (Admin)
const updateResearch = async (req, res) => {
  try {
    const { title, abstract, year, tags, link } = req.body;
    const research = await Research.findById(req.params.id);

    if (research) {
      research.title = title || research.title;
      research.abstract = abstract || research.abstract;
      research.year = year || research.year;
      research.link = link || research.link;

      if (tags) {
        research.tags = tags.split(",").map((t) => t.trim());
      }
      if (req.file) {
        if (!isConfigured()) {
          return res
            .status(500)
            .json({ message: "Cloudinary is not configured" });
        }
        await deleteFile(research.pdfFile);
        const upload = await uploadBuffer(req.file.buffer, {
          folder: "portfolio/research",
          resource_type: "raw",
          use_filename: true,
          unique_filename: false,
        });
        research.pdfFile = upload.secure_url;
      }

      const updatedResearch = await research.save();
      res.json(updatedResearch);
    } else {
      res.status(404).json({ message: "Research not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteResearch = async (req, res) => {
  try {
    const research = await Research.findById(req.params.id);
    if (!research) return res.status(404).json({ message: "Not found" });

    await deleteFile(research.pdfFile);

    await research.deleteOne();
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResearch,
  createResearch,
  updateResearch,
  deleteResearch,
};
