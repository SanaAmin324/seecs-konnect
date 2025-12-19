import { Heart, Reply } from "lucide-react";
import { useState } from "react";

const Comment = ({ comment }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="bg-white border rounded-xl p-4 space-y-2">

      <div className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {comment.author}
        </span>{" "}
        • {comment.time}
      </div>

      <p className="text-sm">{comment.text}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
          {likes}
        </button>

        <button className="flex items-center gap-1 hover:text-foreground">
          <Reply size={14} />
          Reply
        </button>
      </div>
    </div>
  );
};

export default Comment;
