const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumPost",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: ["spam", "inappropriate", "harassment", "misinformation", "other"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    notes: String, // Admin notes
  },
  { timestamps: true }
);

// Prevent duplicate reports from the same user on the same post
reportSchema.index({ post: 1, reportedBy: 1 }, { unique: true });

module.exports = mongoose.model("Report", reportSchema);
