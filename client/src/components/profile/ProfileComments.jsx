import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { formatTimeAgo } from "@/lib/timeUtils";

const ProfileComments = ({ user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/forums/user/comments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching user comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserComments();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">No comments yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-card rounded-xl border p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <p className="text-sm text-foreground mb-2">{comment.text}</p>
              <div className="text-xs text-muted-foreground">
                {comment.post ? (
                  <>
                    On post by <span className="font-medium">{comment.post.user?.name}</span>
                    {" • "}
                    {formatTimeAgo(comment.createdAt)}
                  </>
                ) : (
                  <>
                    {formatTimeAgo(comment.createdAt)}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileComments;
