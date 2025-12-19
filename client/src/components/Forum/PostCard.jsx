import {
  Heart,
  MessageSquare,
  Share2,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PostCard = ({ post, viewType }) => {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const goToPost = () => {
    navigate(`/forums/${post.id}`);
  };

  const timeAgo = (date) => {
    const diff = Math.floor(
      // eslint-disable-next-line react-hooks/purity
      (Date.now() - new Date(date)) / (1000 * 60 * 60)
    );
    return `${diff}h ago`;
  };

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    // later → send to backend (optimistic update)
  };

  return (
    <div
      className="bg-white rounded-xl border border-border/50 hover:shadow-md transition cursor-pointer"
      onClick={goToPost}
    >
      <div className="flex">

        {/* LIKE COLUMN */}
        <div
          className="flex flex-col items-center px-3 py-4 text-muted-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleLike}
            className={`transition ${
              liked ? "text-red-500" : "hover:text-red-500"
            }`}
          >
            <Heart
              size={22}
              fill={liked ? "currentColor" : "none"}
            />
          </button>

          <span className="font-semibold text-sm mt-1">
            {likes}
          </span>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4">

          {/* HEADER */}
          <div className="text-xs text-muted-foreground mb-1">
            <span className="font-semibold text-foreground">
              r/{post.subreddit}
            </span>{" "}
            • Posted by {post.author} • {timeAgo(post.createdAt)}
          </div>

          {/* TITLE */}
          <h3 className="font-semibold text-lg hover:underline">
            {post.title}
          </h3>

          {/* MEDIA / TEXT */}
          {(viewType === "card" || expanded) && (
            <>
              {post.image && (
                <img
                  src={post.image}
                  alt="post media"
                  className="rounded-lg mt-3 max-h-[350px] object-cover"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <p className="mt-2 text-sm text-foreground">
                {post.content}
              </p>
            </>
          )}

          {/* EXPAND BUTTON */}
          {viewType === "compact" && !expanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
              className="mt-2 text-xs text-primary flex items-center gap-1"
            >
              Expand content <ChevronDown size={14} />
            </button>
          )}

          {/* ACTION BAR */}
          <div
            className="flex items-center gap-4 text-xs text-muted-foreground mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={goToPost}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <MessageSquare size={14} />
              {post.commentsCount} comments
            </button>

            <button className="flex items-center gap-1 hover:text-foreground">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
