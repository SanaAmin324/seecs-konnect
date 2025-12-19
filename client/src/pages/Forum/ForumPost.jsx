import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import PostDetailCard from "@/components/forum/Post/PostDetailCard";
import AddComment from "@/components/forum/Post/AddComment";
import CommentToolbar from "@/components/forum/Post/CommentToolbar";
import CommentSection from "@/components/forum/Post/CommentSection";
import RightSidebarCard from "@/components/forum/RightSidebarCard";

const ForumPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  // TEMP mock post
  const post = {
    id: postId,
    title: "How do I prepare for my Software Engineering viva?",
    author: "Fatima",
    createdAt: "2025-01-15T10:00:00",
    content:
      "I have my viva next week and would appreciate tips from seniors.",
    media: "https://via.placeholder.com/600x300",
    likes: 124,
    commentsCount: 8,
  };

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
          <AddComment />

          {/* COMMENT TOOLS */}
          <CommentToolbar />

          {/* COMMENTS */}
          <CommentSection />
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
