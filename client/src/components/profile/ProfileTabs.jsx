const tabs = [
  { id: "overview", label: "Overview" },
  { id: "posts", label: "Posts" },
  { id: "comments", label: "Comments" },
  { id: "favourites", label: "Favourite Documents" },
  { id: "saved", label: "Saved Posts" },
  { id: "liked", label: "Liked Posts" },
];

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-6 border-b text-sm overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2 whitespace-nowrap font-medium ${
            activeTab === tab.id
              ? "border-b-2 border-orange-500 text-foreground"
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
