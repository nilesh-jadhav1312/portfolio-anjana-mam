const express = require("express");
const router = express.Router();
const {
  authAdmin,
  registerAdmin,
  updateAdmin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", authAdmin);
router.post("/register", registerAdmin);
router.put("/update", protect, updateAdmin);

module.exports = router;
