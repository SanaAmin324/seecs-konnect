import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/forum/${postId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  /* ADD COMMENT */
  const addComment = (text) => {
    if (!text.trim()) return;
    // Handled in AddComment
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

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      {/* Comments */}
      <div className="space-y-4">
        {comments.map((c) => (
          <CommentItem
            key={c._id}
            comment={{
              id: c._id,
              author: c.user.name,
              text: c.text,
              time: new Date(c.createdAt).toLocaleString(),
              replies: [], // Assuming no nested replies for now
            }}
            onReplySubmit={handleReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
