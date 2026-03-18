const express = require("express");
const router = express.Router();
const {
  getResearch,
  createResearch,
  updateResearch,
  deleteResearch,
} = require("../controllers/researchController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getResearch)
  .post(protect, createResearch);

router
  .route("/:id")
  .put(protect, updateResearch)
  .delete(protect, deleteResearch);

module.exports = router;
