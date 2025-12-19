const tabs = [
  { id: "text", label: "Text" },
  { id: "image", label: "Images" },
  { id: "video", label: "Video" },
  { id: "link", label: "Link" }
];

const PostTypeTabs = ({ postType, setPostType }) => {
  return (
    <div
      role="tablist"
      className="flex border-b bg-background"
    >
      {tabs.map((tab) => {
        const active = postType === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setPostType(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium transition
              border-b-2 -mb-px
              ${
                active
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default PostTypeTabs;
