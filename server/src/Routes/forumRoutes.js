const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const forumUpload = require("../middleware/forumUpload");

const {
  createPost,
  getAllPosts,
  getPost,
  toggleLike,
  toggleRepost,
  sharePost,
  deletePost,
  addComment,
  getComments,
  editPost,
  removeMediaFromPost,
} = require("../controllers/forumController");

// Create a post (with media)
router.post("/", protect, forumUpload.array("media", 5), createPost);

// Get all posts
router.get("/", protect, getAllPosts);

// Get single post
router.get("/:id", protect, getPost);

// Like/unlike
router.post("/:id/like", protect, toggleLike);

// Repost
router.post("/:id/repost", protect, toggleRepost);

// Share a post
router.post("/:id/share", protect, sharePost);

// Edit a post
router.patch("/:postId", protect, forumUpload.array("media", 5), editPost);

// Remove media from post
router.delete("/:postId/media/:mediaIndex", protect, removeMediaFromPost);

// Delete a post
router.delete("/:postId", protect, deletePost);

// Add a comment
router.post("/:postId/comment", protect, addComment);

// Get comments for a post
router.get("/:postId/comments", protect, getComments);

module.exports = router;
