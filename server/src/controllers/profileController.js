const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// @desc    Get user by ID (public profile view)
// @route   GET /api/profile/:userId
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select("-password")
    .populate("connections", "name email profilePicture headline");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update allowed fields only
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
  user.headline = req.body.headline !== undefined ? req.body.headline : user.headline;
  user.location = req.body.location !== undefined ? req.body.location : user.location;
  user.website = req.body.website !== undefined ? req.body.website : user.website;
  
  if (req.body.socialLinks) {
    user.socialLinks = {
      linkedin: req.body.socialLinks.linkedin !== undefined ? req.body.socialLinks.linkedin : user.socialLinks.linkedin,
      github: req.body.socialLinks.github !== undefined ? req.body.socialLinks.github : user.socialLinks.github,
      twitter: req.body.socialLinks.twitter !== undefined ? req.body.socialLinks.twitter : user.socialLinks.twitter,
    };
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePicture: updatedUser.profilePicture,
    bio: updatedUser.bio,
    headline: updatedUser.headline,
    location: updatedUser.location,
    website: updatedUser.website,
    socialLinks: updatedUser.socialLinks,
  });
});

// @desc    Upload profile picture
// @route   POST /api/profile/upload-picture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete old profile picture if exists
  if (user.profilePicture) {
    const oldPicturePath = path.join(__dirname, "../../", user.profilePicture);
    if (fs.existsSync(oldPicturePath)) {
      fs.unlinkSync(oldPicturePath);
    }
  }

  // Save new profile picture path
  user.profilePicture = `/uploads/profile/${req.file.filename}`;
  await user.save();

  res.json({
    message: "Profile picture uploaded successfully",
    profilePicture: user.profilePicture,
  });
});

// @desc    Send connection request
// @route   POST /api/profile/connect/:userId
// @access  Private
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user._id;

  if (targetUserId === currentUserId.toString()) {
    res.status(400);
    throw new Error("You cannot connect with yourself");
  }

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if already connected
  if (currentUser.connections.includes(targetUserId)) {
    res.status(400);
    throw new Error("Already connected");
  }

  // Check if request already sent
  if (targetUser.connectionRequests.includes(currentUserId)) {
    res.status(400);
    throw new Error("Connection request already sent");
  }

  // Add connection request
  targetUser.connectionRequests.push(currentUserId);
  await targetUser.save();

  res.json({ message: "Connection request sent successfully" });
});

// @desc    Accept connection request
// @route   POST /api/profile/accept/:userId
// @access  Private
const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const requesterId = req.params.userId;
  const currentUserId = req.user._id;

  const currentUser = await User.findById(currentUserId);
  const requester = await User.findById(requesterId);

  if (!requester) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if request exists
  if (!currentUser.connectionRequests.includes(requesterId)) {
    res.status(400);
    throw new Error("No connection request from this user");
  }

  // Add to connections
  currentUser.connections.push(requesterId);
  requester.connections.push(currentUserId);

  // Remove from connection requests
  currentUser.connectionRequests = currentUser.connectionRequests.filter(
    (id) => id.toString() !== requesterId
  );

  await currentUser.save();
  await requester.save();

  res.json({ message: "Connection request accepted" });
});

// @desc    Reject connection request
// @route   DELETE /api/profile/reject/:userId
// @access  Private
const rejectConnectionRequest = asyncHandler(async (req, res) => {
  const requesterId = req.params.userId;
  const currentUser = await User.findById(req.user._id);

  currentUser.connectionRequests = currentUser.connectionRequests.filter(
    (id) => id.toString() !== requesterId
  );

  await currentUser.save();

  res.json({ message: "Connection request rejected" });
});

// @desc    Remove connection
// @route   DELETE /api/profile/disconnect/:userId
// @access  Private
const removeConnection = asyncHandler(async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user._id;

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Remove from both users' connections
  currentUser.connections = currentUser.connections.filter(
    (id) => id.toString() !== targetUserId
  );
  targetUser.connections = targetUser.connections.filter(
    (id) => id.toString() !== currentUserId.toString()
  );

  await currentUser.save();
  await targetUser.save();

  res.json({ message: "Connection removed successfully" });
});

// @desc    Get connection status with another user
// @route   GET /api/profile/connection-status/:userId
// @access  Private
const getConnectionStatus = asyncHandler(async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUser = await User.findById(req.user._id);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const isConnected = currentUser.connections.includes(targetUserId);
  const requestSent = targetUser.connectionRequests.includes(req.user._id.toString());
  const requestReceived = currentUser.connectionRequests.includes(targetUserId);

  res.json({
    isConnected,
    requestSent,
    requestReceived,
  });
});

module.exports = {
  getUserById,
  updateUserProfile,
  uploadProfilePicture,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getConnectionStatus,
};
