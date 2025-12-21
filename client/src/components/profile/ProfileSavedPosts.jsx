import PostCard from "@/components/forum/PostCard";

const ProfileSavedPosts = () => {
  const savedPosts = [
    { id: 11, title: "React useContext Explained", author: "Ali" },
  ];

  return (
    <div className="space-y-4">
      {savedPosts.map((post) => (
        <PostCard key={post.id} post={post} viewType="card" />
      ))}
    </div>
  );
};

export default ProfileSavedPosts;
