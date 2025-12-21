import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";

export default function DocumentCategory() {
  const { data, setData } = useDocumentUpload();
  const navigate = useNavigate();
  
  const categories = [
    "Lecture Notes",
    "Assignments",
    "Research Papers",
    "Exams",
    "Other"
  ];

  const handleNext = () => {
    if (!data.category) return alert("Please select a category");
    navigate("/documents/review");
  };

  return (
    <MainLayout>
      <DocumentProgressBar currentStep={3} />

      <h1 className="text-2xl font-bold mb-4">Category & Description</h1>

      <div className="max-w-xl mx-auto space-y-4">
        <select
          value={data.category || ""}
          onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={handleNext}
          className="w-full mt-4 bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}
