const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// -----------------------------------------------------
// GET ALL NOTIFICATIONS
// GET /api/notifications
// -----------------------------------------------------
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(notifications);
});

// -----------------------------------------------------
// GET UNREAD COUNT
// GET /api/notifications/unread-count
// -----------------------------------------------------
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    read: false,
  });

  res.json({ unreadCount: count });
});

// -----------------------------------------------------
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// -----------------------------------------------------
exports.markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notif.read = true;
  await notif.save();

  res.json({ message: "Notification marked as read" });
});

// -----------------------------------------------------
// MARK ALL AS READ
// PATCH /api/notifications/mark-all
// -----------------------------------------------------
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );

  res.json({ message: "All notifications marked as read" });
});
