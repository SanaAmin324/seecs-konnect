import { useState } from "react";

const AddComment = ({ postId }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/forum/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      setText("");
      // Optionally refresh comments
      window.location.reload(); // Simple way, or use state management
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Comment"}
        </button>
      </div>
    </div>
  );
};

export default AddComment;
