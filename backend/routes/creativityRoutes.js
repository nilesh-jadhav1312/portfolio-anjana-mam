const express = require("express");
const router = express.Router();
const {
  getCreativity,
  createCreativity,
  updateCreativity,
  deleteCreativity,
} = require("../controllers/creativityController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getCreativity)
  .post(protect, upload.single("image"), createCreativity);

router
  .route("/:id")
  .put(protect, upload.single("image"), updateCreativity)
  .delete(protect, deleteCreativity);

module.exports = router;
