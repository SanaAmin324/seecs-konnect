const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile = true }) => {
  const allTabs = [
    { id: "overview", label: "Overview", public: true },
    { id: "posts", label: "Posts", public: true },
    { id: "reposts", label: "Reposted Posts", public: true },
    { id: "comments", label: "Comments", public: true },
    { id: "favourites", label: "Favourite Documents", public: false },
    { id: "saved", label: "Saved Posts", public: false },
    { id: "liked", label: "Liked Posts", public: false },
  ];

  // Filter tabs based on whether viewing own profile or not
  const tabs = isOwnProfile ? allTabs : allTabs.filter(tab => tab.public);

  return (
    <div className="flex gap-6 border-b text-sm overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2 whitespace-nowrap font-medium ${
            activeTab === tab.id
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
