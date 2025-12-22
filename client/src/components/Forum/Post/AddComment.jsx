import { useState } from "react";

const AddComment = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const res = await fetch(`http://localhost:5000/api/forums/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add comment");
      }
      
      setText("");
      
      // Trigger refresh in parent if callback provided
      if (onCommentAdded) {
        onCommentAdded();
      } else {
        // Fallback: reload page
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
        placeholder="Add a comment..."
        className="w-full border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground"
        rows={3}
        disabled={isSubmitting}
      />
      
      {error && <p className="text-red-500 text-xs">{error}</p>}
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !text.trim()}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
        >
          {isSubmitting ? "Posting..." : "Comment"}
        </button>
      </div>
    </div>
  );
};

export default AddComment;
