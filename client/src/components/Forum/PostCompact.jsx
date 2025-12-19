import { ArrowBigUp, MessageSquare, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";


const PostCompact = ({ post, onExpand }) => {
  const navigate = useNavigate();

  const timeAgo = (date) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60));
    return `${diff}h ago`;
  };

  return (
    <div
      onClick={() => navigate(`/forums/${post.id}`)}
      className="bg-white border rounded-lg px-4 py-3 hover:bg-muted cursor-pointer"
    >
      {/* HEADER */}
      <div className="flex items-center text-xs text-muted-foreground mb-1">
        <span className="font-semibold text-foreground">
          r/{post.subreddit}
        </span>
        <span className="mx-1">•</span>
        <span>{timeAgo(post.createdAt)}</span>
      </div>

      {/* TITLE */}
      <p className="font-medium text-sm text-foreground line-clamp-2">
        {post.title}
      </p>

      {/* ACTION ROW */}
      <div
        className="flex items-center gap-4 mt-2 text-xs text-muted-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          <ArrowBigUp size={14} />
          {post.upvotes}
        </div>

        <button
          onClick={() => navigate(`/forums/${post.id}`)}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <MessageSquare size={14} />
          {post.commentsCount}
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
