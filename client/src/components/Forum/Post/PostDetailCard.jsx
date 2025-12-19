import PostHeader from "../PostHeader";
import PostMedia from "../PostMedia";
import PostActions from "./PostActions";

const PostDetailCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">

      <PostHeader author={post.author} createdAt={post.createdAt} />

      <h1 className="text-xl font-semibold">{post.title}</h1>

      {post.media && <PostMedia media={post.media} />}

      <p className="text-gray-800">{post.content}</p>

      <PostActions
        likes={post.likes}
        commentsCount={post.commentsCount}
      />
    </div>
  );
};

export default PostDetailCard;
