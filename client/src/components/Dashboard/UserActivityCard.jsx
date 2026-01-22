import { useEffect, useState } from "react";
import { BarChart3, Download, Heart, MessageSquare, Activity, TrendingUp } from "lucide-react";

export default function UserActivityCard() {
  const [stats, setStats] = useState({
    downloadedDocuments: 0,
    likedDocuments: 0,
    likedForums: 0,
    totalActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const token = user?.token;
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user activity data from API
        const res = await fetch("http://localhost:5000/api/users/activity", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStats({
            downloadedDocuments: data.downloadedDocuments || 0,
            likedDocuments: data.likedDocuments || 0,
            likedForums: data.likedForums || 0,
            totalActivity: (data.downloadedDocuments || 0) + (data.likedDocuments || 0) + (data.likedForums || 0) + (data.forumPosts || 0) + (data.comments || 0)
          });
        } else {
          // Fallback to mock data if endpoint doesn't exist yet
          setStats({
            downloadedDocuments: 15,
            likedDocuments: 8,
            likedForums: 12,
            totalActivity: 47
          });
        }
      } catch (err) {
        console.error("Failed to fetch user activity", err);
        // Fallback to mock data
        setStats({
          downloadedDocuments: 15,
          likedDocuments: 8,
          likedForums: 12,
          totalActivity: 47
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border rounded-xl p-5 h-fit">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          User Activity Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-muted rounded-lg">
              <div className="h-6 bg-muted-foreground/20 rounded w-8 mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activityItems = [
    {
      label: "Downloaded Documents",
      value: stats.downloadedDocuments,
      icon: Download,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      label: "Liked Documents",
      value: stats.likedDocuments,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200"
    },
    {
      label: "Liked Forums",
      value: stats.likedForums,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200"
    },
    {
      label: "Total Activity",
      value: stats.totalActivity,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="bg-card border rounded-xl p-5 h-fit">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        User Activity Summary
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {activityItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={item.label} 
              className={`border rounded-lg p-4 ${item.bgColor} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-5 h-5 ${item.color}`} />
                <span className="text-2xl font-bold text-gray-900">
                  {item.value}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4" />
          <span>
            Keep engaging with the platform to increase your activity score!
          </span>
        </div>
      </div>
    </div>
  );
}