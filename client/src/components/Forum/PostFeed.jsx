import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PostCard from "./PostCard";
import PostCompact from "./PostCompact";
import SortBar from "./SortBar";

const PostFeed = ({ sortType, setSortType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewType, setViewType] = useState("card");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token;
        
        if (!token) {
          navigate("/login", { state: { from: location.pathname } });
          return;
        }

        const res = await fetch("http://localhost:5000/api/forums", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("user");
            navigate("/login", { state: { from: location.pathname } });
            return;
          }
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [navigate, location.pathname]);

  const sortedPosts =
    sortType === "recent"
      ? [...posts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : [...posts].sort((a, b) => b.likes?.length - a.likes?.length);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* SORT BAR */}
      <SortBar
        sortType={sortType}
        setSortType={setSortType}
        viewType={viewType}
        setViewType={setViewType}
      />

      {/* POSTS */}
      <div className="space-y-4">
        {sortedPosts.map((post) =>
          viewType === "card" ? (
            <PostCard key={post._id} post={post} viewType={viewType} />
          ) : (
            <PostCompact key={post._id} post={post} />
          )
        )}
      </div>
    </div>
  );
};

export default PostFeed;
