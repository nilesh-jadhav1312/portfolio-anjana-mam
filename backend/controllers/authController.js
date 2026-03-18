const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const authAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ username, password });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin credentials
// @route   PUT /api/auth/update
// @access  Private (Admin)
const updateAdmin = async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (newUsername && newUsername !== admin.username) {
      const existing = await Admin.findOne({ username: newUsername });
      if (existing) {
        return res.status(400).json({ message: "Username already in use" });
      }
      admin.username = newUsername;
    }

    if (newPassword) {
      admin.password = newPassword;
    }

    if (!newUsername && !newPassword) {
      return res
        .status(400)
        .json({ message: "Provide a new username or a new password" });
    }

    const updated = await admin.save();

    res.json({
      _id: updated._id,
      username: updated.username,
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authAdmin, registerAdmin, updateAdmin };
