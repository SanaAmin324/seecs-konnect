const Report = require("../models/Report");
const ForumPost = require("../models/ForumPost");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// -----------------------------------------------------
// REPORT A POST
// -----------------------------------------------------
const reportPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { reason, description } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const validReasons = [
    "spam",
    "inappropriate",
    "harassment",
    "misinformation",
    "other",
  ];
  if (!reason || !validReasons.includes(reason)) {
    return res.status(400).json({ message: "Invalid report reason" });
  }

  // Check if post exists
  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Check if user already reported this post
  const existingReport = await Report.findOne({
    post: postId,
    reportedBy: userId,
  });

  if (existingReport) {
    return res.status(400).json({
      message: "You have already reported this post",
    });
  }

  // Create report
  const report = await Report.create({
    post: postId,
    reportedBy: userId,
    reason,
    description: description?.trim() || "",
  });

  res.status(201).json({
    message: "Post reported successfully",
    report,
  });
});

// -----------------------------------------------------
// GET REPORTS (ADMIN ONLY)
// -----------------------------------------------------
const getReports = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view reports");
  }

  const { status } = req.query; // Filter by status if provided

  let query = {};
  if (status && ["pending", "reviewed", "resolved", "dismissed"].includes(status)) {
    query.status = status;
  }

  const reports = await Report.find(query)
    .populate("post", "content user")
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(reports);
});

// -----------------------------------------------------
// GET REPORTS FOR A SPECIFIC POST (ADMIN)
// -----------------------------------------------------
const getPostReports = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view reports");
  }

  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const reports = await Report.find({ post: postId })
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(reports);
});

// -----------------------------------------------------
// UPDATE REPORT STATUS (ADMIN ONLY)
// -----------------------------------------------------
const updateReportStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update reports");
  }

  const { reportId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ["pending", "reviewed", "resolved", "dismissed"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (!mongoose.isValidObjectId(reportId)) {
    return res.status(400).json({ message: "Invalid report id" });
  }

  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      status,
      notes: notes?.trim() || "",
    },
    { new: true }
  )
    .populate("post", "content user")
    .populate("reportedBy", "name email");

  if (!report) return res.status(404).json({ message: "Report not found" });

  res.json({
    message: "Report updated successfully",
    report,
  });
});

module.exports = {
  reportPost,
  getReports,
  getPostReports,
  updateReportStatus,
};
