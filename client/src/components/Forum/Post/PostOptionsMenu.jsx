import { useState } from "react";
import { MoreVertical, Edit, Trash2, Flag } from "lucide-react";
import EditPostModal from "./EditPostModal";
import ReportPostModal from "./ReportPostModal";

const PostOptionsMenu = ({ post, currentUserId, isAdmin, onPostDeleted, onPostEdited }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = post.user._id === currentUserId || isAdmin;
  const canDelete = post.user._id === currentUserId || isAdmin;
  const canReport = post.user._id !== currentUserId; // Can't report own post

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/forum/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      alert("Post deleted successfully");
      setShowMenu(false);
      if (onPostDeleted) onPostDeleted();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 hover:bg-gray-200 rounded-full transition"
        title="More options"
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          {/* Edit Button */}
          {canEdit && (
            <button
              onClick={() => {
                setShowEditModal(true);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
            >
              <Edit size={16} />
              Edit Post
            </button>
          )}

          {/* Delete Button */}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Trash2 size={16} />
              {isDeleting ? "Deleting..." : "Delete Post"}
            </button>
          )}

          {/* Report Button */}
          {canReport && (
            <button
              onClick={() => {
                setShowReportModal(true);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-orange-50 text-orange-600 flex items-center gap-2 text-sm border-t"
            >
              <Flag size={16} />
              Report Post
            </button>
          )}

          {/* Close button if no actions available */}
          {!canEdit && !canDelete && !canReport && (
            <div className="px-4 py-2 text-sm text-gray-500">No actions available</div>
          )}
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onPostEdited={onPostEdited}
        />
      )}

      {showReportModal && (
        <ReportPostModal
          postId={post._id}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default PostOptionsMenu;
