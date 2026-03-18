const Research = require("../models/Research");

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
    const { title, abstract, year, tags, link, pdfFile } = req.body;

    // Parse comma-separated tags
    const tagsArray = tags ? tags.split(",").map((t) => t.trim()) : [];

    const research = await Research.create({
      title,
      abstract,
      year,
      tags: tagsArray,
      pdfFile: pdfFile || null,
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
    const { title, abstract, year, tags, link, pdfFile } = req.body;
    const research = await Research.findById(req.params.id);

    if (research) {
      research.title = title || research.title;
      research.abstract = abstract || research.abstract;
      research.year = year || research.year;
      research.link = link || research.link;

      if (tags) {
        research.tags = tags.split(",").map((t) => t.trim());
      }
      if (typeof pdfFile === "string") {
        research.pdfFile = pdfFile;
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
