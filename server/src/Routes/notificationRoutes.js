const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// Get all notifications
router.get("/", protect, getNotifications);

// Get unread count
router.get("/unread-count", protect, getUnreadCount);

// Mark all notifications as read (MUST come before /:id routes)
router.patch("/mark-all", protect, markAllAsRead);

// Mark one notification as read
router.patch("/:id/read", protect, markAsRead);

module.exports = router;
