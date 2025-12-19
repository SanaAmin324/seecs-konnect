import { useState } from "react";
import CommentItem from "./CommentItem";

const CommentSection = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Ali",
      text: "This helped a lot!",
      time: "1 day ago",
      replies: [],
    },
    {
      id: 2,
      author: "Sana",
      text: "Can you explain more?",
      time: "3 hours ago",
      replies: [],
    },
  ]);

  /* ADD COMMENT */
  const addComment = (text) => {
    if (!text.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "You",
        text,
        time: "Just now",
        replies: [],
      },
    ]);
  };

  /* ADD REPLY (RECURSIVE) */
  const addReply = (commentId, text, list = comments) => {
    return list.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: Date.now(),
              author: "You",
              text,
              time: "Just now",
              replies: [],
            },
          ],
        };
      }

      return {
        ...c,
        replies: addReply(commentId, text, c.replies),
      };
    });
  };

  const handleReply = (commentId, text) => {
    setComments((prev) => addReply(commentId, text, prev));
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      {/* New comment input */}
      <CommentItem isNew onSubmit={addComment} />

      {/* Comments */}
      <div className="space-y-4">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onReplySubmit={handleReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
