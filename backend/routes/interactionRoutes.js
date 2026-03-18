const express = require("express");
const router = express.Router();
const {
  getInteractions,
  createInteraction,
  updateInteraction,
  deleteInteraction,
} = require("../controllers/interactionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getInteractions).post(protect, createInteraction);

router
  .route("/:id")
  .put(protect, updateInteraction)
  .delete(protect, deleteInteraction);

module.exports = router;
