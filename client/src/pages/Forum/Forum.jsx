import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import PostFeed from "@/components/forum/PostFeed";
import RecentlyViewed from "@/components/forum/RecentlyViewed";
import CreatePostButton from "../../components/forum/CreatePostButton";


const Forum = () => {
  const [sortType, setSortType] = useState("recent");
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("recentlyViewedPosts")) || [];
    setRecentlyViewed(stored);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/40 px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          
          {/* MAIN FEED */}
          <div className="lg:col-span-3">
            <PostFeed
              sortType={sortType}
              setSortType={setSortType}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block">
            <RecentlyViewed posts={recentlyViewed} />
          </div>
          <CreatePostButton />

        </div>
      </div>
    </MainLayout>
  );
};

export default Forum;
