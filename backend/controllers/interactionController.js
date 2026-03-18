const Interaction = require("../models/Interaction");

const getInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.find().sort({ date: -1 });
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.create(req.body);
    res.status(201).json(interaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) return res.status(404).json({ message: "Not found" });

    Object.assign(interaction, req.body);
    const updated = await interaction.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) return res.status(404).json({ message: "Not found" });
    await interaction.deleteOne();
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInteractions,
  createInteraction,
  updateInteraction,
  deleteInteraction,
};
