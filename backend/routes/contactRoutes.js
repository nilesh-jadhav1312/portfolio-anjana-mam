const express = require("express");
const router = express.Router();
const {
  getMessages,
  createMessage,
  deleteMessage,
  markAsRead,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getMessages).post(createMessage);

router.route("/:id").delete(protect, deleteMessage).put(protect, markAsRead);

module.exports = router;
