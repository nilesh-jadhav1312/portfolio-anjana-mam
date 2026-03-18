const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");

// Routes
router
  .route("/")
  .get(getCertificates)
  .post(protect, upload.single("certificateFile"), createCertificate);

router
  .route("/:id")
  .put(protect, upload.single("certificateFile"), updateCertificate)
  .delete(protect, deleteCertificate);

module.exports = router;
