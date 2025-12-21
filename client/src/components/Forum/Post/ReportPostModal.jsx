import { useState } from "react";
import { X } from "lucide-react";

const ReportPostModal = ({ postId, onClose }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const reasons = [
    { value: "spam", label: "Spam" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "harassment", label: "Harassment" },
    { value: "misinformation", label: "Misinformation" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please select a reason");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/reports/${postId}/report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason,
            description: description.trim(),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to report post");
      }

      setSuccess(true);
      setReason("");
      setDescription("");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to report post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Report This Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {!success ? (
          <div className="p-6 space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Why are you reporting this post?
              </label>
              <div className="space-y-2">
                {reasons.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more context about your report..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                rows={4}
              />
            </div>

            <p className="text-xs text-gray-500">
              Your report will be reviewed by our moderation team. We take all
              reports seriously.
            </p>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-semibold text-green-700">Report Submitted</h3>
            <p className="text-sm text-gray-600">
              Thank you for helping keep our community safe. Our team will
              review your report shortly.
            </p>
          </div>
        )}

        {/* Footer */}
        {!success && (
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !reason}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}

        {success && (
          <div className="flex justify-end p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPostModal;
