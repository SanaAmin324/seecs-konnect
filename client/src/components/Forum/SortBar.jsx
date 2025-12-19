import { LayoutGrid, AlignJustify } from "lucide-react";

const ForumSortBar = ({
  sortType,
  setSortType,
  viewType,
  setViewType,
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-4 py-3 mb-4">

      {/* Sort buttons */}
      <div className="flex gap-2">
        {["recent", "popular"].map((type) => (
          <button
            key={type}
            onClick={() => setSortType(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${
                sortType === type
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/70"
              }
            `}
          >
            {type === "recent" ? "Recent" : "Popular"}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewType("card")}
          className={`p-2 rounded-lg transition
            ${
              viewType === "card"
                ? "bg-primary text-white"
                : "bg-muted hover:bg-muted/70"
            }
          `}
        >
          <LayoutGrid size={18} />
        </button>

        <button
          onClick={() => setViewType("compact")}
          className={`p-2 rounded-lg transition
            ${
              viewType === "compact"
                ? "bg-primary text-white"
                : "bg-muted hover:bg-muted/70"
            }
          `}
        >
          <AlignJustify size={18} />
        </button>
      </div>
    </div>
  );
};

export default ForumSortBar;
