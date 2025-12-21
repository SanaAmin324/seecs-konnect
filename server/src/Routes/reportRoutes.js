const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  reportPost,
  getReports,
  getPostReports,
  updateReportStatus,
} = require("../controllers/reportController");

// Report a post
router.post("/:postId/report", protect, reportPost);

// Get all reports (admin only)
router.get("/", protect, getReports);

// Get reports for a specific post (admin only)
router.get("/:postId", protect, getPostReports);

// Update report status (admin only)
router.patch("/:reportId/status", protect, updateReportStatus);

module.exports = router;
