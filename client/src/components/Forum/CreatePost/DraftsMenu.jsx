import { useState } from "react";
import { Trash2 } from "lucide-react";

const DraftsMenu = ({ onLoadDraft, onDeleteDraft }) => {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get current user ID
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  // Get only drafts for current user
  const drafts = Object.keys(localStorage)
    .filter((k) => k.startsWith("draft-") && k.includes(`draft-${userId}-`))
    .map((k) => ({ key: k, ...JSON.parse(localStorage.getItem(k)) }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleDelete = (e, draftKey) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this draft?")) {
      onDeleteDraft(draftKey);
      setRefreshKey(prev => prev + 1); // Force re-render
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Drafts ({drafts.length})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-background border rounded-md shadow-lg z-50">
          {drafts.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">
              No drafts saved
            </p>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.key}
                className="flex items-center gap-2 p-3 text-sm hover:bg-muted border-b last:border-b-0"
              >
                <button
                  onClick={() => {
                    onLoadDraft(draft);
                    setOpen(false);
                  }}
                  className="flex-1 text-left"
                >
                  <div className="font-medium truncate">
                    {draft.textBody?.substring(0, 50) || draft.title || "Untitled Draft"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(draft.updatedAt).toLocaleString()}
                  </div>
                </button>
                <button
                  onClick={(e) => handleDelete(e, draft.key)}
                  className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition"
                  title="Delete draft"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DraftsMenu;
