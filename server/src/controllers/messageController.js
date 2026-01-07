const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');

// Generate conversation ID (always same for two users regardless of order)
const getConversationId = (userId1, userId2) => {
  return [userId1.toString(), userId2.toString()].sort().join('_');
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all messages where user is sender or receiver
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }]
  })
    .populate('sender', 'name username profilePicture')
    .populate('receiver', 'name username profilePicture')
    .sort({ createdAt: -1 });

  // Group by conversation and get last message + unread count
  const conversationsMap = new Map();

  for (const message of messages) {
    const convId = message.conversationId;
    
    if (!conversationsMap.has(convId)) {
      const otherUser = message.sender._id.toString() === userId.toString() 
        ? message.receiver 
        : message.sender;

      // Count unread messages from this conversation
      const unreadCount = await Message.countDocuments({
        conversationId: convId,
        receiver: userId,
        read: false
      });

      conversationsMap.set(convId, {
        conversationId: convId,
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          username: otherUser.username,
          profilePicture: otherUser.profilePicture
        },
        lastMessage: {
          content: message.content,
          createdAt: message.createdAt,
          senderId: message.sender._id
        },
        unreadCount
      });
    }
  }

  const conversations = Array.from(conversationsMap.values());
  res.json(conversations);
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const otherUserId = req.params.userId;

  const conversationId = getConversationId(currentUserId, otherUserId);

  const messages = await Message.find({ conversationId })
    .populate('sender', 'name username profilePicture')
    .populate('receiver', 'name username profilePicture')
    .sort({ createdAt: 1 }); // Oldest first

  res.json(messages);
});

// @desc    Send a message
// @route   POST /api/messages/:userId
// @access  Private
exports.sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.userId;
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Message content is required');
  }

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error('User not found');
  }

  const conversationId = getConversationId(senderId, receiverId);

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content: content.trim(),
    conversationId
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name username profilePicture')
    .populate('receiver', 'name username profilePicture');

  res.status(201).json(populatedMessage);
});

// @desc    Mark messages as read
// @route   PATCH /api/messages/:userId/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const otherUserId = req.params.userId;

  const conversationId = getConversationId(currentUserId, otherUserId);

  await Message.updateMany(
    {
      conversationId,
      receiver: currentUserId,
      read: false
    },
    { read: true }
  );

  res.json({ message: 'Messages marked as read' });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({
    receiver: req.user._id,
    read: false
  });

  res.json({ unreadCount: count });
});
