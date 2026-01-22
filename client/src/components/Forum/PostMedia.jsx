const PostMedia = ({ media }) => {
  if (!media || media.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden">
      {media.map((item, idx) => {
        const mediaUrl = `http://localhost:5000/uploads/forum/${item.filename}`;
        
        // Determine type from either item.type or filename extension
        const typeFromExt = item.filename?.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i) ? 'video' : 'image';
        const mediaType = item.type || typeFromExt;
        
        if (mediaType === "video") {
          return (
            <video
              key={idx}
              src={mediaUrl}
              className="w-full max-h-[500px] object-contain bg-black rounded-lg"
              controls
              controlsList="nodownload"
              preload="metadata"
              onError={(e) => {
                console.error("Video loading error:", e);
                console.error("Failed to load video from:", mediaUrl);
              }}
            >
              Your browser does not support the video tag.
            </video>
          );
        } else {
          return (
            <img
              key={idx}
              src={mediaUrl}
              alt="Post media"
              className="w-full max-h-[500px] object-contain rounded-lg bg-muted"
              onError={(e) => {
                console.error("Image loading error:", e);
                console.error("Failed to load image from:", mediaUrl);
              }}
            />
          );
        }
      })}
    </div>
  );
};

export default PostMedia;
  