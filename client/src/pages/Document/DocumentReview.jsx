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
      // Send all document metadata as a JSON string
      const docsMeta = data.files.map(f => ({
        title: f.title,
        description: f.description,
        course: f.course,
        academicYear: f.academicYear,
        category: f.category
      }));
      form.append("documents", JSON.stringify(docsMeta));
      // Explicitly append top-level fields for backend compatibility (first document)
      if (data.files && data.files.length > 0) {
        const first = data.files[0];
        form.append("title", first.title || "");
        form.append("description", first.description || "");
        form.append("course", first.course || "");
        form.append("academicYear", first.academicYear || "");
        form.append("category", first.category || "");
      }
      // Attach all files
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
          <div key={i} className="border p-4 rounded mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Document {i + 1}: {f.title}</span>
              <span className="text-muted-foreground text-sm">{f.file?.type}</span>
            </div>
            <div className="ml-2">
              <p><strong>Course:</strong> {f.course}</p>
              <p><strong>Academic Year:</strong> {f.academicYear}</p>
              <p><strong>Category:</strong> {f.category}</p>
              <p><strong>Description:</strong> {f.description}</p>
            </div>
          </div>
        ))}

        {notification && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {notification}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/documents/category")}
            className="flex-1 bg-muted text-foreground py-2 rounded hover:bg-muted/80"
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
