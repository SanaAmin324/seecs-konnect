const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount
} = require('../controllers/messageController');

// Get unread count
router.get('/unread/count', protect, getUnreadCount);

// Get all conversations
router.get('/conversations', protect, getConversations);

// Get messages with a specific user
router.get('/:userId', protect, getMessages);

// Send message to a user
router.post('/:userId', protect, sendMessage);

// Mark conversation as read
router.patch('/:userId/read', protect, markAsRead);

module.exports = router;
