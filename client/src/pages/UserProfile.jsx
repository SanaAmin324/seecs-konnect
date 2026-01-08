import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/layouts/MainLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfilePosts from "@/components/profile/ProfilePosts";
import ProfileReposts from "@/components/profile/ProfileReposts";
import ProfileComments from "@/components/profile/ProfileComments";
import ProfileAboutCard from "@/components/profile/ProfileAboutCard";
import ProfileFavourites from "@/components/profile/ProfileFavourites";
import ProfileSavedPosts from "@/components/profile/ProfileSavedPosts";
import ProfileLikedPosts from "@/components/profile/ProfileLikedPosts";

const UserProfile = () => {
  const { user } = useAuth();
  const { userId, username } = useParams(); // Get userId or username from URL params
  const [activeTab, setActiveTab] = useState("overview");
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("UserProfile - userId from URL:", userId);
  console.log("UserProfile - username from URL:", username);
  console.log("UserProfile - current user ID:", user?._id);

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        setLoading(true); // Set loading when fetching new profile
        const authUser = JSON.parse(localStorage.getItem("user"));
        
        // Determine the target: userId, username, or own profile
        let apiUrl;
        if (userId) {
          // Route: /profile/:userId
          apiUrl = `http://localhost:5000/api/profile/${userId}`;
          console.log("Fetching profile by userId:", userId);
        } else if (username) {
          // Route: /u/:username - need to fetch by username
          apiUrl = `http://localhost:5000/api/profile/username/${username}`;
          console.log("Fetching profile by username:", username);
        } else {
          // No params - own profile
          apiUrl = `http://localhost:5000/api/profile/${user?._id}`;
          console.log("Fetching own profile for userId:", user?._id);
        }
        
        if (!apiUrl || (!userId && !username && !user?._id)) {
          setLoading(false);
          return;
        }
        
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched profile data:", data);
          console.log("Is this my profile?", data._id === user?._id);
          setProfileUser(data);
        } else {
          console.error("Failed to fetch user profile");
          setProfileUser(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileUser();
  }, [userId, username, user?._id]); // Trigger on userId, username, or current user change

  // Determine if viewing own profile - MUST be calculated after profileUser is fetched
  const isOwnProfile = profileUser?._id === user?._id;

  console.log("UserProfile - isOwnProfile:", isOwnProfile);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading profile...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profileUser) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">User not found</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // For admins viewing their own profile
  const isAdmin = profileUser?.role === "admin" && isOwnProfile;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <ProfileHeader user={profileUser} isOwnProfile={isOwnProfile} />

        {!isAdmin ? (
          <>
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* LEFT CONTENT */}
              <div className="lg:col-span-3">
                {activeTab === "overview" && <ProfileOverview user={profileUser} />}
                {activeTab === "posts" && <ProfilePosts user={profileUser} />}
                {activeTab === "reposts" && <ProfileReposts user={profileUser} />}
                {activeTab === "comments" && <ProfileComments user={profileUser} />}
                {isOwnProfile && activeTab === "favourites" && <ProfileFavourites user={profileUser} />}
                {isOwnProfile && activeTab === "saved" && <ProfileSavedPosts user={profileUser} />}
                {isOwnProfile && activeTab === "liked" && <ProfileLikedPosts user={profileUser} />}
              </div>
              {/* RIGHT SIDEBAR */}
              <div className="hidden lg:block">
                <ProfileAboutCard user={profileUser} />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground">Welcome, {profileUser?.name}! Manage your administrative tasks from the admin panel in the sidebar.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserProfile;
