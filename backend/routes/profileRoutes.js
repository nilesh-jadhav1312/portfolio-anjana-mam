const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .get(getProfile)
  .put(
    protect,
    upload.fields([
      { name: "profileImage", maxCount: 1 },
    ]),
    updateProfile,
  );

module.exports = router;
