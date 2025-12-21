import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  /* ADD COMMENT */
  const addComment = (text) => {
    if (!text.trim()) return;
    // Handled in AddComment, but can add local optimistic update here
  };

  /* ADD REPLY (RECURSIVE) */
  const addReply = (commentId, text, list = comments) => {
    return list.map((c) => {
      if (c._id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              _id: Date.now(),
              author: "You",
              text,
              createdAt: new Date().toISOString(),
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

  // Expose refresh method to parent if needed
  const handleCommentAdded = () => {
    fetchComments();
  };

  if (loading) return <div className="text-center py-4">Loading comments...</div>;
  if (error) return <div className="text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      {/* Comments */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={{
                id: c._id,
                author: c.user?.name || "Unknown",
                text: c.text,
                time: new Date(c.createdAt).toLocaleString(),
                replies: [], // Assuming no nested replies for now
              }}
              onReplySubmit={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
