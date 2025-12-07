import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DocumentInfo() {
  const { data, setData } = useDocumentUpload();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [descError, setDescError] = useState("");

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
            setData((prev) => ({
              ...prev,
              files: prev.files.map((f, i) =>
                i === 0 ? { ...f, title: e.target.value } : f
              ),
            }))
          }
          className="w-full border px-3 py-2 rounded"
        />

        <div className="max-w-xl mx-auto mt-6">
          <label htmlFor="description" className="block mb-2 font-semibold">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description (minimum 10 characters)"
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              setDescription(value);
              setDescriptionLength(value.length);

              if (value.length < 10) {
                setDescError("Description must be at least 10 characters.");
              } else {
                setDescError("");
                setData((prev) => ({ ...prev, description: value })); // save to context
              }
            }}
            className="border p-2 w-full rounded"
          />
          <p className="text-sm text-gray-500">
            {descriptionLength}/10 characters
          </p>
          {descError && <p className="text-red-600 mt-1">{descError}</p>}
        </div>

        <select
          value={data.course || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, course: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Course</option>
          <option value="CS101">CS101</option>
          <option value="CS102">CS102</option>
        </select>

        <select
          value={data.className || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, className: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Class</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>

        <select
          value={data.academicYear || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, academicYear: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        <button
          disabled={descError !== "" || description.length === 0}
          onClick={() => navigate("/documents/category")}
          className={`w-full mt-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 ${
            descError || description.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}
