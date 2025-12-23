import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecentForumPostsCard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/forum/recent")
      .then((res) => res.json())
      .then(setPosts)
      .catch(() => {});
  }, []);

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Recent Forum Posts
      </h2>

      <ul className="space-y-3">
        {posts.slice(0, 5).map((post) => (
          <li key={post._id}>
            <Link
              to={`/forums/${post._id}`}
              className="font-medium hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-muted-foreground text-sm">
              by {post.author?.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
