import { Heart, MessageSquare, Share2, Repeat2 } from "lucide-react";
import { useState, useEffect } from "react";
import ShareModal from "../ShareModal";

const PostActions = ({ likes, commentsCount, postId, postTitle }) => {
  const token = localStorage.getItem("token");
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);
  const [reposted, setReposted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Check if user liked
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    // Assuming likes is populated array of users
    // For simplicity, since we don't have populated likes in detail, assume not liked
  }, [token]);

  const toggleLike = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/forum/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRepost = async () => {
    if (reposted) return;
    try {
      const res = await fetch(`http://localhost:5000/api/forum/${postId}/repost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to repost");
      setReposted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">

      <button
        onClick={toggleLike}
        className={`flex items-center gap-1 ${
          liked ? "text-red-500" : "hover:text-red-500"
        }`}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
        {count}
      </button>

      <div className="flex items-center gap-1">
        <MessageSquare size={16} />
        {commentsCount} comments
      </div>

      <button
        onClick={handleRepost}
        className={`flex items-center gap-1 hover:text-foreground ${
          reposted ? "text-green-500" : ""
        }`}
      >
        <Repeat2 size={16} />
        Repost
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-1 hover:text-foreground"
      >
        <Share2 size={16} />
        Share
      </button>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={postId}
        postTitle={postTitle}
      />
    </div>
  );
};

export default PostActions;
