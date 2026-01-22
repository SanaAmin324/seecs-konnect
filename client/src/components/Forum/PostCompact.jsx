import { ArrowBigUp, MessageSquare, ChevronDown, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


const PostCompact = ({ post, onExpand }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (token && user?._id) {
      const userId = user._id;
      setLiked(post.likes?.some(like => like._id?.toString() === userId || like.toString() === userId));
    }
  }, [post, token, user]);

  const toggleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/api/forums/${post._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  const timeAgo = (date) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60));
    return `${diff}h ago`;
  };

  return (
    <div
      onClick={() => navigate(`/forums/${post._id}`)}
      className="bg-white border rounded-lg px-4 py-3 hover:bg-muted cursor-pointer"
    >
      {/* HEADER */}
      <div className="flex items-center text-xs text-muted-foreground mb-1">
        <span className="font-semibold text-foreground">
          {post.user?.name || 'Unknown User'}
        </span>
        <span className="mx-1">•</span>
        <span>{timeAgo(post.createdAt)}</span>
      </div>

      {/* TITLE */}
      <p className="font-medium text-sm text-foreground line-clamp-2">
        {post.content}
      </p>

      {/* ACTION ROW */}
      <div
        className="flex items-center gap-4 mt-2 text-xs text-muted-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 transition ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
          {likes}
        </button>

        <button
          onClick={() => navigate(`/forums/${post._id}`)}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <MessageSquare size={14} />
          {post.commentCount || 0}
        </button>

        <button
          onClick={onExpand}
          className="flex items-center gap-1 text-primary"
        >
          <ChevronDown size={14} />
          Expand
        </button>
      </div>
    </div>
  );
};

export default PostCompact;
