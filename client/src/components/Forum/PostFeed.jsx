import { useState } from "react";
import PostCard from "./PostCard";
import PostCompact from "./PostCompact";
import SortBar from "./SortBar";

const dummyPosts = [
  {
    id: 1,
    title: "How to prepare for SE midterms?",
    author: "Ali",
    content: "Any good resources or tips?",
    createdAt: "2025-12-12",
    views: 12,
    upvotes: 8,
    comments: 3,
  },
  {
    id: 2,
    title: "How to prepare for SE midterms?",
    author: "Ali",
    content: "Any good resources or tips?",
    createdAt: "2025-12-12",
    views: 12,
    upvotes: 8,
    comments: 3,
  }
  ,
];

const PostFeed = ({ sortType, setSortType }) => {
  const [viewType, setViewType] = useState("card");

  const sortedPosts =
    sortType === "recent"
      ? [...dummyPosts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : [...dummyPosts].sort((a, b) => b.views - a.views);

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
            <PostCard key={post.id} post={post} />
          ) : (
            <PostCompact key={post.id} post={post} />
          )
        )}
      </div>
    </div>
  );
};

export default PostFeed;
