const PostMedia = ({ media }) => {
    if (!media) return null;
  
    return (
      <img
        src={media}
        alt="Post media"
        className="w-full rounded-lg max-h-[400px] object-cover"
      />
    );
  };
  
  export default PostMedia;
  