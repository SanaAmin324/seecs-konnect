const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const forumUpload = require("../middleware/forumUpload");

const {
  createPost,
  getAllPosts,
  toggleLike,
  repost,
  sharePost,
  deletePost,
  addComment,
  getComments,
  deleteComment,
  editPost,
} = require("../controllers/forumController");

// Create a post (with media)
router.post("/", protect, forumUpload.array("media", 5), createPost);

// Get all posts
router.get("/", protect, getAllPosts);

// Like/unlike
router.post("/:id/like", protect, toggleLike);

// Repost
router.post("/:id/repost", protect, repost);

// Share a post
router.post("/:id/share", protect, sharePost);

// Delete a post
router.delete("/:postId", protect, deletePost);

// Add a comment
router.post("/:postId/comment", protect, addComment);

// Get comments
router.get("/:postId/comments", getComments);

// Delete a comment
router.delete("/comments/:commentId", protect, deleteComment);

// Edit a post (content + media)
router.patch("/:postId", protect, forumUpload.array("media", 5), editPost);





module.exports = router;
