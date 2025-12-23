import MainLayout from "@/layouts/MainLayout";
import RecentDocumentsCard from "../components/Dashboard/RecentDocumentsCard";
import RecentForumPostsCard from "../components/Dashboard/RecentForumPostsCard";
import UserStatsCard from "../components/Dashboard/UserStatsCard";
import EventsCard from "../components/Dashboard/EventsCard";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/40 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Left */}
          <RecentDocumentsCard />

          {/* Top Right */}
          <UserStatsCard />

          {/* Bottom Left */}
          <RecentForumPostsCard />

          {/* Bottom Right */}
          <EventsCard />
        </div>
      </div>
    </MainLayout>
  );
}
