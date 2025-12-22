import { useState, useEffect } from "react";
import PostCard from "@/components/forum/PostCard";

const ProfileSavedPosts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/forums/user/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">Loading saved posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">No saved posts yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} viewType="card" />
      ))}
    </div>
  );
};

export default ProfileSavedPosts;
