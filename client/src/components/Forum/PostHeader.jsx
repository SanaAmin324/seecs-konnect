const PostHeader = ({ author, createdAt }) => {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-semibold text-black">{author}</span>
        <span>•</span>
        <span>{createdAt}</span>
      </div>
    );
  };
  
  export default PostHeader;
  