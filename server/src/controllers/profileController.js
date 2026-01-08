const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Notification = require("../models/Notification");
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

// @desc    Get user by username (public profile view)
// @route   GET /api/profile/username/:username
// @access  Private
const getUserByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() })
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

  // Handle username update with validation
  if (req.body.username !== undefined && req.body.username !== user.username) {
    const newUsername = req.body.username.toLowerCase().trim();
    
    // Validate username format
    const usernameRegex = /^[a-z0-9_.]+$/;
    if (!usernameRegex.test(newUsername)) {
      res.status(400);
      throw new Error("Username can only contain lowercase letters, numbers, underscores, and dots");
    }
    
    if (newUsername.length < 3 || newUsername.length > 30) {
      res.status(400);
      throw new Error("Username must be between 3 and 30 characters");
    }
    
    // Check if username is already taken
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      res.status(400);
      throw new Error("Username is already taken");
    }
    
    user.username = newUsername;
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
    username: updatedUser.username,
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
  console.log('Upload picture request received');
  console.log('File:', req.file);
  console.log('User:', req.user?._id);
  
  try {
    if (!req.file) {
      console.log('No file in request');
      res.status(400);
      throw new Error("No file uploaded");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log('User not found:', req.user._id);
      // Clean up uploaded file if user not found
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(404);
      throw new Error("User not found");
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPicturePath = path.join(__dirname, "../../", user.profilePicture);
      if (fs.existsSync(oldPicturePath)) {
        try {
          fs.unlinkSync(oldPicturePath);
          console.log('Deleted old profile picture');
        } catch (err) {
          console.error("Error deleting old profile picture:", err);
        }
      }
    }

    // Save new profile picture path
    user.profilePicture = `/uploads/profile/${req.file.filename}`;
    await user.save();

    console.log('Profile picture saved:', user.profilePicture);

    res.json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    }
    throw error;
  }
});

// @desc    Remove profile picture
// @route   DELETE /api/profile/remove-picture
// @access  Private
const removeProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete profile picture file if exists
  if (user.profilePicture) {
    const picturePath = path.join(__dirname, "../../", user.profilePicture);
    if (fs.existsSync(picturePath)) {
      try {
        fs.unlinkSync(picturePath);
        console.log('Deleted profile picture:', picturePath);
      } catch (err) {
        console.error("Error deleting profile picture:", err);
      }
    }
  }

  // Clear profile picture path
  user.profilePicture = "";
  await user.save();

  res.json({
    message: "Profile picture removed successfully",
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
  const alreadyConnected = currentUser.connections.some(
    (id) => id.toString() === targetUserId.toString()
  );
  if (alreadyConnected) {
    res.status(400);
    throw new Error("Already connected");
  }

  // Check if request already sent
  const requestAlreadySent = targetUser.connectionRequests.some(
    (id) => id.toString() === currentUserId.toString()
  );
  if (requestAlreadySent) {
    res.status(400);
    throw new Error("Connection request already sent");
  }

  // Add connection request
  targetUser.connectionRequests.push(currentUserId);
  await targetUser.save();

  // Create notification
  await Notification.create({
    user: targetUserId,
    type: 'connection_request',
    from: currentUserId,
    message: `${currentUser.name} sent you a connection request`,
  });

  res.json({ message: "Connection request sent successfully" });
});

// @desc    Accept connection request
// @route   POST /api/profile/accept/:userId
// @access  Private
const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const requesterId = req.params.userId;
  const currentUserId = req.user._id;

  // ATOMIC OPERATION: Use findOneAndUpdate to check and remove in one operation
  // This prevents race conditions from duplicate requests
  const currentUser = await User.findOneAndUpdate(
    {
      _id: currentUserId,
      connectionRequests: requesterId  // Only match if request exists
    },
    {
      $pull: { connectionRequests: requesterId },  // Remove the request
      $addToSet: { connections: requesterId }      // Add to connections (addToSet prevents duplicates)
    },
    {
      new: false  // Return the document BEFORE update (to check if request existed)
    }
  );

  // If no document matched, the request doesn't exist or was already processed
  if (!currentUser) {
    // Clean up orphaned notification
    await Notification.deleteOne({
      user: currentUserId,
      from: requesterId,
      type: 'connection_request',
    });
    
    res.status(400);
    throw new Error("No connection request from this user. The request may have been cancelled or already processed. Please ask them to send a new request.");
  }

  const requester = await User.findById(requesterId);

  if (!requester) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if already connected (should not happen with atomic operation, but just in case)
  const alreadyConnected = currentUser.connections.some(
    (id) => id.toString() === requesterId.toString()
  );

  if (alreadyConnected) {
    res.status(400);
    throw new Error("Already connected with this user");
  }

  // Update requester's connections atomically
  await User.findByIdAndUpdate(
    requesterId,
    { $addToSet: { connections: currentUserId } }
  );

  // Update the connection_request notification to connection_accepted
  // This keeps it visible with "You are now connected" message
  // Mark as read so it doesn't count in badge, but stays visible
  await Notification.findOneAndUpdate(
    {
      user: currentUserId,
      from: requesterId,
      type: 'connection_request',
    },
    {
      type: 'connection_accepted',
      message: `You are now connected with ${requester.name}`,
      read: true  // Mark as read so counter decreases, but notification stays visible
    }
  );

  // Create notification for the requester
  await Notification.create({
    user: requesterId,
    type: 'connection_accepted',
    from: currentUserId,
    message: `${currentUser.name} accepted your connection request`,
  });

  res.json({ 
    message: "Connection request accepted successfully",
    userName: requester.name 
  });
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

// @desc    Cancel connection request (withdraw sent request)
// @route   DELETE /api/profile/cancel-request/:userId
// @access  Private
const cancelConnectionRequest = asyncHandler(async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user._id;

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Remove from target user's connection requests
  targetUser.connectionRequests = targetUser.connectionRequests.filter(
    (id) => id.toString() !== currentUserId.toString()
  );

  await targetUser.save();

  // Remove the notification
  await Notification.deleteOne({
    user: targetUserId,
    from: currentUserId,
    type: 'connection_request',
  });

  res.json({ message: "Connection request cancelled" });
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

  // Delete connection-related notifications
  await Notification.deleteMany({
    $or: [
      { user: currentUserId, from: targetUserId, type: 'connection_request' },
      { user: targetUserId, from: currentUserId, type: 'connection_request' },
      { user: currentUserId, from: targetUserId, type: 'connection_accepted' },
      { user: targetUserId, from: currentUserId, type: 'connection_accepted' }
    ]
  });

  res.json({ message: "Connection removed successfully" });
});

// @desc    Get user connections
// @route   GET /api/profile/connections/:userId?
// @access  Private
const getUserConnections = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;

  const user = await User.findById(userId)
    .populate('connections', 'name email username profilePicture headline program batch')
    .select('connections');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.connections);
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

// @desc    Check if username is available
// @route   GET /api/profile/check-username/:username
// @access  Public
const checkUsernameAvailability = asyncHandler(async (req, res) => {
  const { username } = req.params;
  
  // Validate username format
  const usernameRegex = /^[a-z0-9_.]+$/;
  if (!usernameRegex.test(username)) {
    res.status(400);
    throw new Error("Username can only contain lowercase letters, numbers, underscores, and dots");
  }
  
  if (username.length < 3 || username.length > 30) {
    res.status(400);
    throw new Error("Username must be between 3 and 30 characters");
  }
  
  const existingUser = await User.findOne({ username: username.toLowerCase() });
  
  res.json({
    available: !existingUser,
    username: username.toLowerCase()
  });
});

// @desc    Search users by username or name
// @route   GET /api/profile/search?q=searchterm
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.json([]);
  }
  
  const searchTerm = q.trim();
  
  // Search by username or name (case-insensitive)
  const users = await User.find({
    $or: [
      { username: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .select('_id name username email profilePicture headline bio')
  .limit(20);
  
  res.json(users);
});

module.exports = {
  getUserById,
  getUserByUsername,
  updateUserProfile,
  uploadProfilePicture,
  removeProfilePicture,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
  getUserConnections,
  getConnectionStatus,
  checkUsernameAvailability,
  searchUsers,
};
