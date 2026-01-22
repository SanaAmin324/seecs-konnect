import { useEffect, useState } from "react";
import { MessageSquare, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "@/lib/timeUtils";

export default function RecentForumPostsCard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/forum/recent")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-card border rounded-xl p-5">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Recently Uploaded Forums
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 border rounded-lg">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Recently Uploaded Forums
      </h2>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent forum posts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, 6).map((post) => (
            <div key={post._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <Link
                to={`/forums/${post._id}`}
                className="block"
              >
                <div className="space-y-2">
                  <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>{post.author?.name || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>
                  
                  {post.content && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {post.content.length > 80 ? `${post.content.substring(0, 80)}...` : post.content}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <Link 
            to="/forums"
            className="text-sm text-primary hover:underline"
          >
            View all forum posts →
          </Link>
        </div>
      )}
    </div>
  );
}
