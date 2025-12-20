import PostHeader from "../PostHeader";
import PostMedia from "../PostMedia";
import PostActions from "./PostActions";

const PostDetailCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">

      <PostHeader author={post.user?.name} createdAt={post.createdAt} />

      <h1 className="text-xl font-semibold">{post.content.substring(0, 100)}...</h1>

      {post.media && post.media.length > 0 && <PostMedia media={post.media} />}

      <p className="text-gray-800">{post.content}</p>

      <PostActions
        likes={post.likes?.length || 0}
        commentsCount={post.commentCount}
        postId={post._id}
      />
    </div>
  );
};

export default PostDetailCard;
