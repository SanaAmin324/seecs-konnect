const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
  type: { 
    type: String, 
    enum: [
      'comment', 
      'reply', 
      'like', 
      'repost', 
      'connection_request', 
      'connection_accepted',
      'post_like',
      'post_comment',
      'post_repost'
    ], 
    required: true 
  },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // sender of notification
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' }, // reference to post (for post-related notifications)
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // post or comment id (legacy field)
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

