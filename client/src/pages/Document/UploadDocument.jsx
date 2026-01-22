import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";

export default function UploadDocument() {
  const { setData } = useDocumentUpload();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [confirmed, setConfirmed] = useState(false); // <-- new

  // Add files
  const handleFiles = (incomingFiles) => {
    const newFiles = Array.from(incomingFiles).map((file) => ({
      file,
      title: file.name, // Default title
    }));
    setFiles((prev) => {
      const combined = [...prev, ...newFiles];
      if (combined.length > 3) {
        alert("You can upload a maximum of 3 files per document.");
        return combined.slice(0, 3);
      }
      return combined;
    });
  };

  // Delete a file
  const deleteFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Update file title
  const updateTitle = (index, title) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, title } : f)));
  };

  const handleContinue = () => {
    setData((prev) => ({ ...prev, files }));
    navigate("/documents/info");
  };

  return (
    <MainLayout>
      <DocumentProgressBar currentStep={1} />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Upload Document</h1>
        <p className="text-muted-foreground mt-2">
          Drag & drop files here or click to browse
        </p>
      </div>

      {/* Upload box */}
      <div
        className="max-w-xl mx-auto border-2 border-dashed border-border rounded-xl p-10 bg-card text-center cursor-pointer hover:border-primary transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById("doc-input").click()}
      >
        <input
          id="doc-input"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="text-foreground">
          <p className="text-lg font-semibold">Drag & Drop Files Here</p>
          <p className="text-sm mt-1 text-muted-foreground">or click to browse</p>
        </div>
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="max-w-xl mx-auto mt-6 bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Files Selected (max 3)</h2>
          {files.map((f, i) => (
            <div
              key={i}
              className="flex justify-between items-center mb-3 border p-3 rounded-lg"
            >
              <input
                type="text"
                value={f.title}
                onChange={(e) => updateTitle(i, e.target.value)}
                className="flex-1 border rounded px-2 py-1 mr-4"
              />
              <button
                onClick={() => deleteFile(i)}
                className="text-red-500 font-bold hover:underline"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="confirm" className="text-gray-700">
              I confirm this document is original
            </label>
          </div>

          <button
            onClick={handleContinue}
            disabled={!confirmed}
            className={`w-full mt-4 py-2 rounded-lg text-white ${
              !confirmed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Continue
          </button>
        </div>
      )}
    </MainLayout>
  );
}
