import { useState } from "react";
import { X } from "lucide-react";
import TextEditor from "../CreatePost/TextEditor";

const EditPostModal = ({ post, onClose, onPostEdited }) => {
  const [content, setContent] = useState(post.content);
  const [links, setLinks] = useState(post.links || []);
  const [newLink, setNewLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAddLink = () => {
    if (!newLink.trim()) return;

    // Validate URL
    try {
      new URL(newLink);
      setLinks([...links, { url: newLink }]);
      setNewLink("");
    } catch {
      setError("Invalid URL format");
    }
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("content", content.trim());
      formData.append("links", JSON.stringify(links));

      const res = await fetch(`http://localhost:5000/api/forum/${post._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to edit post");
      }

      alert("Post updated successfully");
      if (onPostEdited) onPostEdited();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to edit post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Text Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <TextEditor value={content} onChange={setContent} />
          </div>

          {/* Links Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Links</label>

            {/* Add new link */}
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                placeholder="https://example.com"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddLink()}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
              >
                Add Link
              </button>
            </div>

            {/* Display existing links */}
            {links.length > 0 && (
              <div className="space-y-2">
                {links.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all flex-1"
                    >
                      🔗 {link.url}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="ml-2 text-red-600 hover:text-red-800 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Media */}
          {post.media && post.media.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Current Media</label>
              <div className="grid grid-cols-3 gap-3">
                {post.media.map((media, idx) => (
                  <div key={idx} className="relative">
                    {media.type === "video" ? (
                      <video
                        src={`http://localhost:5000/uploads/forum/${media.filename}`}
                        className="rounded-lg h-28 w-full object-cover bg-black"
                        controls
                      />
                    ) : (
                      <img
                        src={`http://localhost:5000/uploads/forum/${media.filename}`}
                        className="rounded-lg h-28 w-full object-cover"
                        alt="Post media"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {media.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            💡 To add or remove media, delete this post and create a new one.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
