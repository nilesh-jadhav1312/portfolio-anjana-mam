const Teaching = require("../models/Teaching");

// @desc    Get all teaching courses
// @route   GET /api/teaching
// @access  Public
const getTeachings = async (req, res) => {
  try {
    const teachings = await Teaching.find().sort({ createdAt: -1 });
    res.json(teachings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a teaching course
// @route   POST /api/teaching
// @access  Private (Admin)
const createTeaching = async (req, res) => {
  try {
    const { title, description, year, link } = req.body;
    const teaching = await Teaching.create({
      title,
      description,
      year,
      link,
    });
    res.status(201).json(teaching);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a teaching course
// @route   PUT /api/teaching/:id
// @access  Private (Admin)
const updateTeaching = async (req, res) => {
  try {
    const { title, description, year, link } = req.body;
    const teaching = await Teaching.findById(req.params.id);

    if (teaching) {
      teaching.title = title || teaching.title;
      teaching.description = description || teaching.description;
      teaching.year = year || teaching.year;
      teaching.link = link || teaching.link;

      const updatedTeaching = await teaching.save();
      res.json(updatedTeaching);
    } else {
      res.status(404).json({ message: "Teaching course not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a teaching course
// @route   DELETE /api/teaching/:id
// @access  Private (Admin)
const deleteTeaching = async (req, res) => {
  try {
    const teaching = await Teaching.findById(req.params.id);

    if (teaching) {
      await teaching.deleteOne();
      res.json({ message: "Teaching course removed" });
    } else {
      res.status(404).json({ message: "Teaching course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeachings,
  createTeaching,
  updateTeaching,
  deleteTeaching,
};
