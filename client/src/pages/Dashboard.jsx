import MainLayout from "@/layouts/MainLayout";
import RecentDocumentsCard from "../components/Dashboard/RecentDocumentsCard";
import RecentForumPostsCard from "../components/Dashboard/RecentForumPostsCard";
import UserActivityCard from "../components/Dashboard/UserActivityCard";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/40 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Left - Recently Uploaded Documents */}
            <div className="lg:col-span-1">
              <RecentDocumentsCard />
            </div>

            {/* Top Right - User Activity Summary */}
            <div className="lg:col-span-2">
              <UserActivityCard />
            </div>

            {/* Bottom Left - Recently Uploaded Forums */}
            <div className="lg:col-span-3">
              <RecentForumPostsCard />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
