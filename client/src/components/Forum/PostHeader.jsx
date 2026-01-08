import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "@/lib/timeUtils";

const PostHeader = ({ author, createdAt, userId }) => {
  const navigate = useNavigate();

  const handleAuthorClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span 
        onClick={handleAuthorClick}
        className="font-semibold text-black hover:text-primary cursor-pointer transition"
      >
        {author}
      </span>
      <span>•</span>
      <span>{formatTimeAgo(createdAt)}</span>
    </div>
  );
};

export default PostHeader;
  