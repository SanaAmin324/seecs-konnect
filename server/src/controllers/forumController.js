const ForumPost = require("../models/ForumPost");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// -----------------------------------------------------
// CREATE A POST
// -----------------------------------------------------
exports.createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const mediaFiles = req.files
    ? req.files.map((file) => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      }))
    : [];

  const post = await ForumPost.create({
    user: req.user._id,
    content,
    media: mediaFiles,
  });

  res.status(201).json({
    message: "Forum post created successfully",
    post,
  });
});

// -----------------------------------------------------
// GET ALL POSTS
// -----------------------------------------------------
exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await ForumPost.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// -----------------------------------------------------
// LIKE / UNLIKE POST
// -----------------------------------------------------
exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id;

  if (post.likes.includes(userId)) {
    post.likes.pull(userId);
    await post.save();
    return res.json({ message: "Unliked post" });
  }

  post.likes.push(userId);
  await post.save();
  res.json({ message: "Liked post" });
});

// -----------------------------------------------------
// REPOST
// -----------------------------------------------------
exports.repost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id;

  if (post.reposts.includes(userId)) {
    return res.status(400).json({ message: "Already reposted" });
  }

  post.reposts.push(userId);
  await post.save();

  res.json({ message: "Reposted successfully" });
});
// -----------------------------------------------------
// SHARE POST
// -----------------------------------------------------
exports.sharePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await ForumPost.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.shares.push({
    user: req.user._id,
    comment: comment?.trim() || "",
  });

  await post.save();

  // 🔔 Notification to post owner
  if (post.user.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: post.user,
      type: "repost",
      referenceId: post._id,
      message: `${req.user.name} shared your post`,
    });
  }

  res.json({ message: "Post shared successfully" });
});


// -----------------------------------------------------
// DELETE POST
// -----------------------------------------------------
exports.deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user.toString() !== userId.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this post");
  }

  // Delete media files
  if (post.media && post.media.length > 0) {
    for (const file of post.media) {
      try {
        if (fs.existsSync(file.path)) await fs.promises.unlink(file.path);
      } catch (err) {
        console.error("Failed to delete file:", file.path, err);
      }
    }
  }

  // Delete all comments
  await Comment.deleteMany({ post: post._id });

  await post.remove();

  res.json({ message: "Post and associated comments deleted successfully" });
});

// -----------------------------------------------------
// ADD COMMENT (UPDATED WITH NOTIFICATIONS)
// -----------------------------------------------------
exports.addComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { postId } = req.params;
  const { text, parentComment } = req.body;

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = await Comment.create({
    post: postId,
    user: userId,
    text: text.trim(),
    parentComment: parentComment || null,
  });

  if (typeof post.commentCount === "number") {
    post.commentCount += 1;
    await post.save();
  }

  await comment.populate({ path: "user", select: "name program batch section" });

  // -----------------------------------------------------
  // CREATE NOTIFICATION FOR POST OWNER
  // -----------------------------------------------------
  if (post.user.toString() !== userId.toString()) {
    await Notification.create({
      user: post.user, // post owner
      type: parentComment ? "reply" : "comment",
      referenceId: comment._id,
      message: `${req.user.name} commented on your post`,
    });
  }

  res.status(201).json(comment);
});

// -----------------------------------------------------
// GET COMMENTS
// -----------------------------------------------------
exports.getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comments = await Comment.find({ post: postId, parentComment: null })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({ path: "user", select: "name program batch section" })
    .lean();

  const includeReplies = req.query.replies === "true";

  if (includeReplies) {
    const commentIds = comments.map((c) => c._id);
    const replies = await Comment.find({ parentComment: { $in: commentIds } })
      .sort({ createdAt: 1 })
      .populate({ path: "user", select: "name program batch section" })
      .lean();

    const repliesByParent = replies.reduce((acc, r) => {
      acc[r.parentComment.toString()] = acc[r.parentComment.toString()] || [];
      acc[r.parentComment.toString()].push(r);
      return acc;
    }, {});

    const commentsWithReplies = comments.map((c) => ({
      ...c,
      replies: repliesByParent[c._id.toString()] || [],
    }));

    return res.json({ page, limit, data: commentsWithReplies });
  }

  res.json({ page, limit, data: comments });
});

// -----------------------------------------------------
// DELETE COMMENT
// -----------------------------------------------------
exports.deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    res.status(400);
    throw new Error("Invalid comment id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  const post = await ForumPost.findById(comment.post);
  const isCommentOwner = comment.user.toString() === userId.toString();
  const isPostOwner = post && post.user.toString() === userId.toString();

  if (!isCommentOwner && !isPostOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }

  await Comment.deleteMany({ $or: [{ _id: comment._id }, { parentComment: comment._id }] });

  if (post && typeof post.commentCount === "number" && post.commentCount > 0) {
    post.commentCount -= 1;
    await post.save();
  }

  res.json({ message: "Comment deleted" });
});

// -----------------------------------------------------
// EDIT POST
// -----------------------------------------------------
exports.editPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content, removeMediaIds } = req.body;
  const newFiles = req.files;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this post");
  }

  if (content && content.trim()) post.content = content.trim();

  if (Array.isArray(removeMediaIds) && removeMediaIds.length > 0) {
    post.media = post.media.filter((file) => {
      if (removeMediaIds.includes(file.filename)) {
        try {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Failed to delete file:", file.path, err);
        }
        return false;
      }
      return true;
    });
  }

  if (newFiles && newFiles.length > 0) {
    const mediaFiles = newFiles.map((file) => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    }));
    post.media.push(...mediaFiles);
  }

  await post.save();

  res.json({ message: "Post updated successfully", post });
});
