const RecentlyViewed = ({ posts }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold mb-4">Recently Viewed</h3>
  
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-2">
              <p className="font-medium text-sm">{post.title}</p>
              <p className="text-xs text-gray-500">{post.time}</p>
  
              {post.media && (
                <img
                  src={post.media}
                  alt=""
                  className="rounded mt-2 h-20 w-full object-cover"
                />
              )}
  
              <div className="flex justify-between text-xs mt-2 text-gray-600">
                <span>↑ {post.upvotes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default RecentlyViewed;
  