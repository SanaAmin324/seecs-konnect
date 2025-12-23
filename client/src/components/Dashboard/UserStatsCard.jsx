import { BarChart3 } from "lucide-react";

export default function UserStatsCard() {
  const stats = {
    posts: 12,
    comments: 34,
    documents: 6,
    likes: 89,
  };

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Your Activity
      </h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-3 bg-muted rounded-lg">
            <p className="text-xl font-bold">{value}</p>
            <p className="text-sm capitalize text-muted-foreground">{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
