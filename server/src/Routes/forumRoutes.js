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

// Delete a post
router.delete("/:postId", protect, deletePost);

// Add a comment
router.post("/:postId/comment", protect, addComment);

// Get comments
// router.get("/:postId/comments", getComments);

// Delete a comment
// router.delete("/comments/:commentId", protect, deleteComment);

// Edit a post (content + media)
// router.patch("/:postId", protect, forumUpload.array("media", 5), editPost);





module.exports = router;
