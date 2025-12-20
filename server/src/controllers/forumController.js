const ForumPost = require("../models/ForumPost");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const fs = require("fs");

// -----------------------------------------------------
// CREATE A POST (UPDATED FOR IMAGE + VIDEO + DOC + LINKS)
// -----------------------------------------------------
const createPost = asyncHandler(async (req, res) => {
  const { content, links } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Content is required" });
  }

  // -------------------------
  // Handle uploaded media
  // -------------------------
  const mediaFiles = req.files
    ? req.files.map((file) => {
        let type = "document";

        if (file.mimetype.startsWith("image/")) {
          type = "image";
        } else if (file.mimetype.startsWith("video/")) {
          type = "video";
        }

        return {
          type,
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
        };
      })
    : [];

  // -------------------------
  // Handle links (JSON string)
  // -------------------------
  let parsedLinks = [];
  if (links) {
    try {
      parsedLinks = JSON.parse(links);
      // Expected format:
      // [{ url: "https://example.com", title: "Optional" }]
    } catch (err) {
      return res.status(400).json({ message: "Invalid links format" });
    }
  }

  const post = await ForumPost.create({
    user: req.user._id,
    content: content.trim(),
    media: mediaFiles,
    links: parsedLinks,
  });

  res.status(201).json({
    message: "Forum post created successfully",
    post,
  });
});

// -----------------------------------------------------
// GET SINGLE POST
// -----------------------------------------------------
const getPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "likes",
      select: "name",
    })
    .populate({
      path: "reposts",
      select: "name",
    });

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json(post);
});

// -----------------------------------------------------
// GET ALL POSTS
// -----------------------------------------------------
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await ForumPost.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// -----------------------------------------------------
// LIKE / UNLIKE POST
// -----------------------------------------------------
const toggleLike = asyncHandler(async (req, res) => {
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
// TOGGLE REPOST
// -----------------------------------------------------
const toggleRepost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id;

  if (post.reposts.includes(userId)) {
    post.reposts.pull(userId);
    await post.save();
    return res.json({ message: "Unreposted post" });
  }

  post.reposts.push(userId);
  await post.save();
  res.json({ message: "Reposted post" });
});

// -----------------------------------------------------
// SHARE POST
// -----------------------------------------------------
const sharePost = asyncHandler(async (req, res) => {
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
const deletePost = asyncHandler(async (req, res) => {
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

  if (post.media && post.media.length > 0) {
    for (const file of post.media) {
      try {
        if (fs.existsSync(file.path)) {
          await fs.promises.unlink(file.path);
        }
      } catch (err) {
        console.error("Failed to delete file:", file.path, err);
      }
    }
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({ message: "Post and associated comments deleted successfully" });
});

// -----------------------------------------------------
// ADD COMMENT
// -----------------------------------------------------
const addComment = asyncHandler(async (req, res) => {
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

  post.commentCount += 1;
  await post.save();

  res.status(201).json(comment);
});

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  toggleLike,
  toggleRepost,
  sharePost,
  deletePost,
  addComment,
};