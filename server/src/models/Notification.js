const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
  type: { type: String, enum: ['comment', 'reply', 'like', 'repost'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // post or comment id
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
