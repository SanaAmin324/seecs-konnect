import PostCard from "@/components/forum/PostCard";

const ProfilePosts = () => {
  const posts = [
    { id: 1, title: "React Help", subreddit: "webdev", author: "Fatima" },
  ];

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} viewType="card" />
      ))}
    </div>
  );
};

export default ProfilePosts;
