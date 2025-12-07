const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    media: [
      {
        filename: String,
        path: String,
        mimetype: String,
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reposts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // automatically stores createdAt and updatedAt
  }
);

module.exports = mongoose.model("ForumPost", forumPostSchema);
