import PostCard from "@/components/forum/PostCard";

const ProfileLikedPosts = () => {
  const likedPosts = [
    { id: 21, title: "Best VS Code Extensions", author: "Sara" },
  ];

  return (
    <div className="space-y-4">
      {likedPosts.map((post) => (
        <PostCard key={post.id} post={post} viewType="card" />
      ))}
    </div>
  );
};

export default ProfileLikedPosts;
