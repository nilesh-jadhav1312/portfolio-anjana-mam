const express = require("express");
const router = express.Router();
const {
  getTeachings,
  createTeaching,
  updateTeaching,
  deleteTeaching,
} = require("../controllers/teachingController");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.route("/").get(getTeachings).post(protect, createTeaching);
router
  .route("/:id")
  .put(protect, updateTeaching)
  .delete(protect, deleteTeaching);

module.exports = router;
