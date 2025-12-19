import { useState } from "react";

const DraftsMenu = ({ onLoadDraft }) => {
  const [open, setOpen] = useState(false);

  const drafts = Object.keys(localStorage)
    .filter((k) => k.startsWith("draft-"))
    .map((k) => JSON.parse(localStorage.getItem(k)))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

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
              <button
                key={draft.id}
                onClick={() => {
                  onLoadDraft(draft);
                  setOpen(false);
                }}
                className="w-full text-left p-3 text-sm hover:bg-muted border-b last:border-b-0"
              >
                <div className="font-medium truncate">
                  {draft.title || "Untitled Draft"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(draft.updatedAt).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DraftsMenu;
