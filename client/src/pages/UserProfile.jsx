import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfilePosts from "@/components/profile/ProfilePosts";
import ProfileComments from "@/components/profile/ProfileComments";
import ProfileAboutCard from "@/components/profile/ProfileAboutCard";
import ProfileFavourites from "@/components/profile/ProfileFavourites";
import ProfileSavedPosts from "@/components/profile/ProfileSavedPosts";
import ProfileLikedPosts from "@/components/profile/ProfileLikedPosts";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <ProfileHeader />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && <ProfileOverview />}
            {activeTab === "posts" && <ProfilePosts />}
            {activeTab === "comments" && <ProfileComments />}
            {activeTab === "favourites" && <ProfileFavourites />}
            {activeTab === "saved" && <ProfileSavedPosts />}
            {activeTab === "liked" && <ProfileLikedPosts />}
          </div>
          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block">
            <ProfileAboutCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
