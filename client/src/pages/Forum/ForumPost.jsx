import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import PostDetailCard from "@/components/forum/Post/PostDetailCard";
import AddComment from "@/components/forum/Post/AddComment";
import CommentToolbar from "@/components/forum/Post/CommentToolbar";
import CommentSection from "@/components/forum/Post/CommentSection";
import RightSidebarCard from "@/components/forum/RightSidebarCard";

const ForumPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/forum/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Forum
          </button>

          {/* POST */}
          <PostDetailCard post={post} />

          {/* ADD COMMENT */}
          <AddComment postId={postId} />

          {/* COMMENT TOOLS */}
          <CommentToolbar />

          {/* COMMENTS */}
          <CommentSection postId={postId} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block">
          <RightSidebarCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default ForumPost;
