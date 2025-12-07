import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";

export default function DocumentReview() {
  const { data } = useDocumentUpload();
  const navigate = useNavigate();

  const handleSubmit = () => {
    // TODO: handle actual upload API call
    console.log("Submitting document data:", data);
    alert("Document submitted successfully!");
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

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/documents/category")}
            className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <Link to="/documents">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
