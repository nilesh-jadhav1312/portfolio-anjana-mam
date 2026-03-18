const express = require("express");
const router = express.Router();
const {
  getResearch,
  createResearch,
  updateResearch,
  deleteResearch,
} = require("../controllers/researchController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getResearch)
  .post(protect, upload.single("pdfFile"), createResearch);

router
  .route("/:id")
  .put(protect, upload.single("pdfFile"), updateResearch)
  .delete(protect, deleteResearch);

module.exports = router;
