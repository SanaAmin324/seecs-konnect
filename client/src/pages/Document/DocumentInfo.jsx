import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";

export default function DocumentInfo() {
  const { data, setData } = useDocumentUpload();
  const navigate = useNavigate();

  const handleNext = () => {
    // Optional: validate all required fields
    if (!data.course || !data.className || !data.academicYear) {
      return alert("Please fill all fields");
    }
    navigate("/documents/category");
  };

  return (
    <MainLayout>
      <DocumentProgressBar currentStep={2} />

      <h1 className="text-2xl font-bold mb-4">Document Info</h1>

      <div className="space-y-4 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Title"
          value={data.files?.[0]?.title || ""}
          onChange={(e) =>
            setData(prev => ({
              ...prev,
              files: prev.files.map((f, i) =>
                i === 0 ? { ...f, title: e.target.value } : f
              ),
            }))
          }
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={data.description || ""}
          onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={data.course || ""}
          onChange={(e) => setData(prev => ({ ...prev, course: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Course</option>
          <option value="CS101">CS101</option>
          <option value="CS102">CS102</option>
        </select>

        <select
          value={data.className || ""}
          onChange={(e) => setData(prev => ({ ...prev, className: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Class</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>

        <select
          value={data.academicYear || ""}
          onChange={(e) => setData(prev => ({ ...prev, academicYear: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        <button
          onClick={handleNext}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}
