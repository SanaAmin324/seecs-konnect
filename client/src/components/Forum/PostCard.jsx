import {
  Heart,
  MessageSquare,
  Share2,
  ChevronDown,
  Repeat2,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ShareModal from "./ShareModal";

const PostCard = ({ post, viewType }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [reposts, setReposts] = useState(post.reposts?.length || 0);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
    // Check if current user liked/reposted/saved
    const fetchUserSavedStatus = async () => {
      try {
        if (token) {
          const res = await fetch("http://localhost:5000/api/forums/user/saved", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const savedPosts = await res.json();
            setSaved(savedPosts.some(p => p._id === post._id));
          }
        }
      } catch (err) {
        console.error("Failed to check saved status:", err);
      }
    };
    
    if (token && user?._id) {
      const userId = user._id;
      setLiked(post.likes?.some(like => like._id?.toString() === userId || like.toString() === userId));
      setReposted(post.reposts?.some(repost => repost._id?.toString() === userId || repost.toString() === userId));
      fetchUserSavedStatus();
    }
  }, [post, token, user]);

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

  const handleRepost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/forums/${post._id}/repost`, {
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

  const toggleSave = async () => {
    try {
      if (!token) {
        alert("Please log in to save posts");
        return;
      }
      const res = await fetch(`http://localhost:5000/api/forums/${post._id}/save`, {
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
    <div
      className="bg-card rounded-xl border border-border/50 hover:shadow-md transition cursor-pointer"
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
            <span className="font-semibold text-card-foreground">
              Forum
            </span>{" "}
            • Posted by{" "}
            <span 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${post.user?._id}`);
              }}
              className="font-semibold text-primary hover:underline cursor-pointer"
            >
              {post.user?.name}
            </span>{" "}
            • {timeAgo(post.createdAt)}
          </div>

          {/* TITLE - assuming no title, use content as title or something */}
          <h3 className="font-semibold text-lg hover:underline text-card-foreground">
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

              <p className="mt-3 text-sm text-card-foreground">
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
                              className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition border border-primary/30 cursor-pointer"
                              onClick={() => window.open(link.url, '_blank')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  window.open(link.url, '_blank');
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <span className="text-primary text-lg flex-shrink-0">🔗</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-primary truncate">
                                  {hostname}
                                </div>
                                <div className="text-xs text-primary/70 truncate mt-1">
                                  {link.url}
                                </div>
                              </div>
                              <span className="text-xl text-primary/60 flex-shrink-0">→</span>
                            </div>
                          );
                        } catch (err) {
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition border border-primary/30 cursor-pointer"
                              onClick={() => window.open(link.url, '_blank')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  window.open(link.url, '_blank');
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <span className="text-primary text-lg flex-shrink-0">🔗</span>
                              <span className="text-xs text-primary/70 truncate">
                                {link.url}
                              </span>
                              <span className="text-xl text-primary/60 flex-shrink-0">→</span>
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
              onClick={toggleSave}
              className={`flex items-center gap-1 hover:text-foreground ${
                saved ? "text-blue-500" : ""
              }`}
            >
              <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
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

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={post._id}
        postTitle={post.title}
      />
    </div>
  );
};

export default PostCard;
