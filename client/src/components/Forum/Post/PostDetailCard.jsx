import { useNavigate } from "react-router-dom";
import PostHeader from "../PostHeader";
import PostMedia from "../PostMedia";
import PostActions from "./PostActions";
import PostOptionsMenu from "./PostOptionsMenu";

const PostDetailCard = ({ post, onPostDeleted, onPostEdited }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let currentUserId = null;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      currentUserId = decoded.id;
      isAdmin = decoded.role === "admin";
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

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

  const handlePostDeleted = () => {
    if (onPostDeleted) onPostDeleted();
    else navigate("/forums");
  };

  const handlePostEdited = () => {
    if (onPostEdited) onPostEdited();
  };

  return (
    <div className="bg-card rounded-xl border p-5 space-y-4">
      {/* Header with options menu */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <PostHeader author={post.user?.name} createdAt={post.createdAt} />
        </div>
        <PostOptionsMenu
          post={post}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onPostDeleted={handlePostDeleted}
          onPostEdited={handlePostEdited}
        />
      </div>

      <p className="text-card-foreground leading-relaxed">{getCleanContent(post.content)}</p>

      {post.media && post.media.length > 0 && <PostMedia media={post.media} />}

      {(() => {
        const linksToShow = post.links && post.links.length > 0 
          ? post.links 
          : extractLinksFromContent(post.content);
        
        if (linksToShow.length > 0) {
          return (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Links</p>
              <div className="space-y-2">
                {linksToShow.map((link, idx) => {
                  try {
                    const urlObj = new URL(link.url);
                    const hostname = urlObj.hostname.replace('www.', '');
                    
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition border border-primary/30 cursor-pointer"
                        onClick={() => window.open(link.url, '_blank')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            window.open(link.url, '_blank');
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="text-primary text-2xl flex-shrink-0">🔗</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-primary truncate">
                            {hostname}
                          </div>
                          <div className="text-xs text-primary/70 truncate mt-1">
                            {link.url}
                          </div>
                        </div>
                        <span className="text-2xl text-primary/60 flex-shrink-0">→</span>
                      </div>
                    );
                  } catch (err) {
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition border border-primary/30 cursor-pointer"
                        onClick={() => window.open(link.url, '_blank')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            window.open(link.url, '_blank');
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="text-primary text-2xl flex-shrink-0">🔗</span>
                        <span className="text-sm text-primary/70 truncate">
                          {link.url}
                        </span>
                        <span className="text-2xl text-primary/60 flex-shrink-0">→</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        }
        return null;
      })()}

      <PostActions
        likes={post.likes?.length || 0}
        commentsCount={post.commentCount}
        postId={post._id}
      />
    </div>
  );
};

export default PostDetailCard;
