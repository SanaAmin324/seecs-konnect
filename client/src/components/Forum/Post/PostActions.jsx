import { Heart, MessageSquare, Share2, Repeat2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import ShareModal from "../ShareModal";

const PostActions = ({ likes, commentsCount, postId, postTitle }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Check if user saved this post
    const checkSavedStatus = async () => {
      try {
        if (token) {
          const res = await fetch("http://localhost:5000/api/forums/user/saved", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const savedPosts = await res.json();
            setSaved(savedPosts.some(p => p._id === postId));
          }
        }
      } catch (err) {
        console.error("Failed to check saved status:", err);
      }
    };
    checkSavedStatus();
  }, [token, postId]);

  const toggleLike = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/forums/${postId}/like`, {
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
    try {
      const res = await fetch(`http://localhost:5000/api/forums/${postId}/repost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to repost");
      setReposted((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSave = async () => {
    try {
      if (!token) {
        alert("Please log in to save posts");
        return;
      }
      const res = await fetch(`http://localhost:5000/api/forums/${postId}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to toggle save");
      }
      setSaved((prev) => !prev);
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message || "Failed to save post");
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
        onClick={toggleSave}
        className={`flex items-center gap-1 hover:text-foreground ${
          saved ? "text-blue-500" : ""
        }`}
      >
        <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        {saved ? "Saved" : "Save"}
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
