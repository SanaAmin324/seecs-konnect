import {
  Heart,
  MessageSquare,
  Share2,
  ChevronDown,
  Repeat2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PostCard = ({ post, viewType }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [reposts, setReposts] = useState(post.reposts?.length || 0);
  const [reposted, setReposted] = useState(false);

  // Remove URLs from content text to avoid duplication
  const getCleanContent = (content) => {
    if (!content) return content;
    // Remove common URL patterns from the content
    return content
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/www\.[^\s]+/g, '')
      .trim();
  };

  // Extract URLs from content if links array is not populated
  const extractLinksFromContent = (content) => {
    if (!content) return [];
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    const matches = content.match(urlRegex) || [];
    return matches.map(url => ({
      url: url.startsWith('http') ? url : 'https://' + url
    }));
  };

  useEffect(() => {
    // Check if current user liked/reposted
    const userId = JSON.parse(atob(token.split('.')[1])).id; // decode JWT to get user id
    setLiked(post.likes?.some(like => like.toString() === userId));
    setReposted(post.reposts?.some(repost => repost.toString() === userId));
  }, [post, token]);

  const goToPost = () => {
    navigate(`/forums/${post._id}`);
  };

  const timeAgo = (date) => {
    const diff = Math.floor(
      (Date.now() - new Date(date)) / (1000 * 60 * 60)
    );
    return `${diff}h ago`;
  };

  const toggleLike = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/forum/${post._id}/like`, {
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

  const handleRepost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/forum/${post._id}/repost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to toggle repost");
      setReposted((prev) => !prev);
      setReposts((prev) => (reposted ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/forums/${post._id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
      alert("Failed to copy link");
    }
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
              Forum
            </span>{" "}
            • Posted by {post.user?.name} • {timeAgo(post.createdAt)}
          </div>

          {/* TITLE - assuming no title, use content as title or something */}
          <h3 className="font-semibold text-lg hover:underline">
            {post.content.substring(0, 100)}...
          </h3>

          {/* MEDIA / TEXT */}
          {(viewType === "card" || expanded) && (
            <>
              {post.media && post.media.length > 0 && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  {(() => {
                    const mediaItem = post.media[0];
                    const typeFromExt = mediaItem.filename?.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i) ? 'video' : 'image';
                    const mediaType = mediaItem.type || typeFromExt;
                    
                    return mediaType === "video" ? (
                      <video
                        src={`http://localhost:5000/uploads/forum/${mediaItem.filename}`}
                        className="w-full max-h-[350px] object-cover bg-black rounded-lg"
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        onClick={(e) => e.stopPropagation()}
                        onError={(e) => {
                          console.error("Video loading error:", e);
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:5000/uploads/forum/${mediaItem.filename}`}
                        alt="post media"
                        className="w-full max-h-[350px] object-cover rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                        onError={(e) => {
                          console.error("Image loading error:", e);
                        }}
                      />
                    );
                  })()}
                </div>
              )}

              <p className="mt-3 text-sm text-gray-700">
                {getCleanContent(post.content)}
              </p>

              {(() => {
                const linksToShow = post.links && post.links.length > 0 
                  ? post.links 
                  : extractLinksFromContent(post.content);
                
                if (linksToShow.length > 0) {
                  return (
                    <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
                      {linksToShow.slice(0, 2).map((link, idx) => {
                        try {
                          const urlObj = new URL(link.url);
                          const hostname = urlObj.hostname.replace('www.', '');
                          
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition border border-blue-300 cursor-pointer"
                              onClick={() => window.open(link.url, '_blank')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  window.open(link.url, '_blank');
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <span className="text-blue-600 text-lg flex-shrink-0">🔗</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-blue-700 truncate">
                                  {hostname}
                                </div>
                                <div className="text-xs text-blue-600 truncate mt-1">
                                  {link.url}
                                </div>
                              </div>
                              <span className="text-xl text-blue-400 flex-shrink-0">→</span>
                            </div>
                          );
                        } catch (err) {
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition border border-blue-300 cursor-pointer"
                              onClick={() => window.open(link.url, '_blank')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  window.open(link.url, '_blank');
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <span className="text-blue-600 text-lg flex-shrink-0">🔗</span>
                              <span className="text-xs text-blue-600 truncate">
                                {link.url}
                              </span>
                              <span className="text-xl text-blue-400 flex-shrink-0">→</span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                }
                return null;
              })()}
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
              {post.commentCount} comments
            </button>

            <button
              onClick={handleRepost}
              className={`flex items-center gap-1 hover:text-foreground ${
                reposted ? "text-green-500" : ""
              }`}
            >
              <Repeat2 size={14} />
              {reposts} reposts
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
