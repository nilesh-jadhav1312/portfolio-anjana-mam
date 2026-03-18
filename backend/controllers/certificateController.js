const Certificate = require("../models/Certificate");
const deleteFile = require("../utils/deleteFile");
const { uploadBuffer, isConfigured } = require("../utils/cloudinary");

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a certificate
// @route   POST /api/certificates
// @access  Private (Admin)
const createCertificate = async (req, res) => {
  try {
    const { title, platform, year } = req.body;
    let certificateFile = null;

    if (req.file) {
      if (!isConfigured()) {
        return res
          .status(500)
          .json({ message: "Cloudinary is not configured" });
      }
      const upload = await uploadBuffer(req.file.buffer, {
        folder: "portfolio/certificates",
        resource_type: "raw",
        use_filename: true,
        unique_filename: false,
      });
      certificateFile = upload.secure_url;
    }

    const certificate = await Certificate.create({
      title,
      platform,
      year,
      certificateFile,
    });
    res.status(201).json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a certificate
// @route   PUT /api/certificates/:id
// @access  Private (Admin)
const updateCertificate = async (req, res) => {
  try {
    const { title, platform, year } = req.body;
    const certificate = await Certificate.findById(req.params.id);

    if (certificate) {
      certificate.title = title || certificate.title;
      certificate.platform = platform || certificate.platform;
      certificate.year = year || certificate.year;

      if (req.file) {
        if (!isConfigured()) {
          return res
            .status(500)
            .json({ message: "Cloudinary is not configured" });
        }
        await deleteFile(certificate.certificateFile);
        const upload = await uploadBuffer(req.file.buffer, {
          folder: "portfolio/certificates",
          resource_type: "raw",
          use_filename: true,
          unique_filename: false,
        });
        certificate.certificateFile = upload.secure_url;
      }

      const updatedCertificate = await certificate.save();
      res.json(updatedCertificate);
    } else {
      res.status(404).json({ message: "Certificate not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a certificate
// @route   DELETE /api/certificates/:id
// @access  Private (Admin)
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (certificate) {
      await deleteFile(certificate.certificateFile);

      await certificate.deleteOne();
      res.json({ message: "Certificate removed" });
    } else {
      res.status(404).json({ message: "Certificate not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
