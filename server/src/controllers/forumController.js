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
    .populate("user", "name email username profilePicture")
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
    .populate("user", "name email username profilePicture")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// Get recent posts for dashboard
const getRecentPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("author", "name username profilePicture program batch")
      .populate("user", "name username profilePicture program batch")
      .sort({ createdAt: -1 })
      .limit(10);

    // Map to ensure consistent data structure
    const mappedPosts = posts.map(post => ({
      ...post.toObject(),
      author: post.author || post.user // Ensure author field exists
    }));

    res.json(mappedPosts);
  } catch (err) {
    console.error("Get recent posts error:", err);
    res.status(500).json({ message: "Failed to fetch recent posts" });
  }
});

// -----------------------------------------------------
// LIKE / UNLIKE POST
// -----------------------------------------------------
const toggleLike = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id).populate('user', 'name');
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id;

  if (post.likes.includes(userId)) {
    post.likes.pull(userId);
    await post.save();
    
    // Delete notification when unliked
    await Notification.deleteOne({
      user: post.user._id,
      from: userId,
      type: 'post_like',
      post: post._id
    });
    
    return res.json({ message: "Unliked post" });
  }

  post.likes.push(userId);
  await post.save();
  
  // Create notification for post owner (don't notify yourself)
  if (post.user._id.toString() !== userId.toString()) {
    await Notification.create({
      user: post.user._id,
      type: 'post_like',
      from: userId,
      post: post._id,
      message: `${req.user.name} liked your post`
    });
  }
  
  res.json({ message: "Liked post" });
});

// -----------------------------------------------------
// TOGGLE REPOST
// -----------------------------------------------------
const toggleRepost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id).populate('user', 'name');
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id;

  if (post.reposts.includes(userId)) {
    post.reposts.pull(userId);
    await post.save();
    
    // Delete notification when unreposted
    await Notification.deleteOne({
      user: post.user._id,
      from: userId,
      type: 'post_repost',
      post: post._id
    });
    
    return res.json({ message: "Unreposted post" });
  }

  post.reposts.push(userId);
  await post.save();
  
  // Create notification for post owner (don't notify yourself)
  if (post.user._id.toString() !== userId.toString()) {
    await Notification.create({
      user: post.user._id,
      type: 'post_repost',
      from: userId,
      post: post._id,
      message: `${req.user.name} reposted your post`
    });
  }
  
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

  const post = await ForumPost.findById(postId).populate('user', 'name');
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = await Comment.create({
    post: postId,
    user: userId,
    text: text.trim(),
    parentComment: parentComment || null,
  });

  post.commentCount += 1;
  await post.save();
  
  // Create notification for post owner (don't notify yourself)
  if (post.user._id.toString() !== userId.toString()) {
    await Notification.create({
      user: post.user._id,
      type: 'post_comment',
      from: userId,
      post: post._id,
      message: `${req.user.name} commented on your post`
    });
  }

  res.status(201).json(comment);
});

// -----------------------------------------------------
// GET COMMENTS FOR A POST
// -----------------------------------------------------
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const comments = await Comment.find({ post: postId })
    .populate("user", "name email username profilePicture")
    .sort({ createdAt: -1 });

  res.json(comments);
});

// -----------------------------------------------------
// EDIT POST
// -----------------------------------------------------
const editPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content, links } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Content is required" });
  }

  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Only user who created the post can edit it (or admin)
  if (post.user.toString() !== userId.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this post");
  }

  // Update content
  post.content = content.trim();

  // Update links if provided
  if (links) {
    try {
      post.links = JSON.parse(links);
    } catch (err) {
      return res.status(400).json({ message: "Invalid links format" });
    }
  }

  // Handle new media uploads
  if (req.files && req.files.length > 0) {
    const newMediaFiles = req.files.map((file) => {
      let type = "document";
      if (file.mimetype.startsWith("image/")) type = "image";
      else if (file.mimetype.startsWith("video/")) type = "video";

      return {
        type,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      };
    });

    post.media = [...post.media, ...newMediaFiles];
  }

  await post.save();

  // Populate and return updated post
  await post.populate("user", "name email username profilePicture");

  res.json({
    message: "Post updated successfully",
    post,
  });
});

// -----------------------------------------------------
// REMOVE MEDIA FROM POST
// -----------------------------------------------------
const removeMediaFromPost = asyncHandler(async (req, res) => {
  const { postId, mediaIndex } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Only user who created the post can remove media
  if (post.user.toString() !== userId.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to modify this post");
  }

  const idx = parseInt(mediaIndex);
  if (idx < 0 || idx >= post.media.length) {
    return res.status(400).json({ message: "Invalid media index" });
  }

  // Delete file from storage
  try {
    const file = post.media[idx];
    if (fs.existsSync(file.path)) {
      await fs.promises.unlink(file.path);
    }
  } catch (err) {
    console.error("Failed to delete file:", err);
  }

  // Remove from array
  post.media.splice(idx, 1);
  await post.save();

  res.json({ message: "Media removed successfully" });
});

// -----------------------------------------------------
// GET USER'S POSTS
// -----------------------------------------------------
const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const posts = await ForumPost.find({ user: userId })
    .populate("user", "name email cms program username profilePicture")
    .populate("likes", "name")
    .populate("reposts", "name")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// -----------------------------------------------------
// GET USER'S REPOSTED POSTS
// -----------------------------------------------------
const getUserReposts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const posts = await ForumPost.find({ reposts: userId })
    .populate("user", "name email cms program username profilePicture")
    .populate("likes", "name")
    .populate("reposts", "name")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// -----------------------------------------------------
// GET USER'S LIKED POSTS
// -----------------------------------------------------
const getUserLikedPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const posts = await ForumPost.find({ likes: userId })
    .populate("user", "name email cms program username profilePicture")
    .populate("likes", "name")
    .populate("reposts", "name")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// -----------------------------------------------------
// GET USER'S COMMENTS
// -----------------------------------------------------
const getUserComments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const comments = await Comment.find({ user: userId })
    .populate("user", "name email cms program username profilePicture")
    .populate({
      path: "post",
      select: "content user createdAt",
      populate: {
        path: "user",
        select: "name username"
      }
    })
    .sort({ createdAt: -1 });

  res.json(comments);
});

// -----------------------------------------------------
// TOGGLE SAVE POST
// -----------------------------------------------------
const toggleSavePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const User = require("../models/User");

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await ForumPost.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isSaved = user.savedPosts.includes(postId);

  if (isSaved) {
    user.savedPosts.pull(postId);
    await user.save();
    return res.json({ message: "Post unsaved", isSaved: false });
  } else {
    user.savedPosts.push(postId);
    await user.save();
    return res.json({ message: "Post saved", isSaved: true });
  }
});

// -----------------------------------------------------
// GET USER'S SAVED POSTS
// -----------------------------------------------------
const getUserSavedPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const User = require("../models/User");

  const user = await User.findById(userId).populate({
    path: "savedPosts",
    populate: [
      { path: "user", select: "name email cms program" },
      { path: "likes", select: "name" },
      { path: "reposts", select: "name" }
    ],
    options: { sort: { createdAt: -1 } }
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user.savedPosts || []);
});

// -----------------------------------------------------
// SEARCH POSTS
// -----------------------------------------------------
const searchPosts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.json([]);
  }
  
  const searchTerm = q.trim();
  
  // Search in post content (case-insensitive with text search)
  const posts = await ForumPost.find({
    content: { $regex: searchTerm, $options: 'i' }
  })
  .populate("user", "name username profilePicture")
  .populate({
    path: "comments",
    populate: { path: "user", select: "name username profilePicture" }
  })
  .sort({ createdAt: -1 })
  .limit(50);
  
  // Add commentCount to each post
  const postsWithCount = posts.map(post => {
    const postObj = post.toObject();
    postObj.commentCount = post.comments ? post.comments.length : 0;
    return postObj;
  });
  
  res.json(postsWithCount);
});

module.exports = {
  createPost,
  getAllPosts,
  getRecentPosts,
  getPost,
  toggleLike,
  toggleRepost,
  sharePost,
  deletePost,
  addComment,
  getComments,
  editPost,
  removeMediaFromPost,
  getUserPosts,
  getUserReposts,
  getUserLikedPosts,
  getUserComments,
  toggleSavePost,
  getUserSavedPosts,
  searchPosts,
};