import { Heart, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";

const PostActions = ({ likes, commentsCount }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);

  const toggleLike = () => {
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
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

      <button className="flex items-center gap-1 hover:text-foreground">
        <Share2 size={16} />
        Share
      </button>
    </div>
  );
};

export default PostActions;
