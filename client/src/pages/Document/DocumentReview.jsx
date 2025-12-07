import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DocumentReview() {
  const { data } = useDocumentUpload();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(""); // success message

  const handleSubmit = async () => {
    if (uploading) return;
    setUploading(true);
    setNotification("");

    try {
      console.log("Submitting document data:", data);

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = user?.token;

      const form = new FormData();
      const title = data.files?.[0]?.title || data.title || "Untitled";
      form.append("title", title);
      form.append("description", data.description || "");
      form.append("course", data.course || "");
      form.append("class", data.className || "");
      form.append("academicYear", data.academicYear || "");
      form.append("category", data.category || "");

      if (data.files && Array.isArray(data.files)) {
        data.files.forEach((f) => {
          if (f?.file) form.append("files", f.file);
        });
      }

      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      const resData = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", resData);
        setNotification(resData.message || "Upload failed");
        setUploading(false);
        return;
      }

      // Show notification instead of alert
      setNotification("Document submitted successfully!");
      setUploading(false);

      // Optional: auto-redirect after 2s
      setTimeout(() => {
        navigate("/documents");
      }, 2000);
    } catch (err) {
      console.error(err);
      setNotification("Server error while uploading document");
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <DocumentProgressBar currentStep={4} />

      <h1 className="text-2xl font-bold mb-4">Review & Submit</h1>

      <div className="max-w-xl mx-auto space-y-4 bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold">Files</h2>
        {data.files?.map((f, i) => (
          <div key={i} className="flex justify-between items-center border p-2 rounded">
            <span>{f.title}</span>
            <span className="text-gray-500 text-sm">{f.file?.type}</span>
          </div>
        ))}

        <div>
          <p><strong>Course:</strong> {data.course}</p>
          <p><strong>Class:</strong> {data.className}</p>
          <p><strong>Academic Year:</strong> {data.academicYear}</p>
          <p><strong>Category:</strong> {data.category}</p>
          <p><strong>Description:</strong> {data.description}</p>
        </div>

        {notification && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {notification}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/documents/category")}
            className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className={`flex-1 ${uploading ? 'bg-green-400' : 'bg-green-600'} text-white py-2 rounded hover:bg-green-700`}
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
