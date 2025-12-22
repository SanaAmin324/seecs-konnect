import { useState, useEffect } from "react";
import PostCard from "@/components/forum/PostCard";

const ProfileReposts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReposts = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/forums/user/reposts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching user reposts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReposts();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">Loading reposted posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">No reposted posts yet.</p>
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

export default ProfileReposts;
