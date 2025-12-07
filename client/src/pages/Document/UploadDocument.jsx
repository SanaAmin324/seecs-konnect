import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";

export default function UploadDocument() {
  const { setData } = useDocumentUpload();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  // Add files
  const handleFiles = (incomingFiles) => {
    const newFiles = Array.from(incomingFiles).map(file => ({
      file,
      title: file.name // Default title
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  // Delete a file
  const deleteFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Update file title
  const updateTitle = (index, title) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, title } : f));
  };

  const handleContinue = () => {
    if (files.length === 0) return alert("Please upload at least one file");
    setData(prev => ({ ...prev, files }));
    navigate("/documents/info");
  };

  return (
    <MainLayout>
      <DocumentProgressBar currentStep={1} />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Upload Document</h1>
        <p className="text-gray-500 mt-2">Drag & drop files here or click to browse</p>
      </div>

      {/* Upload box */}
      <div
        className="max-w-xl mx-auto border-2 border-dashed border-gray-400 rounded-xl p-10 bg-white text-center cursor-pointer hover:border-blue-500 transition"
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
        <div className="text-gray-600">
          <p className="text-lg font-semibold">Drag & Drop Files Here</p>
          <p className="text-sm mt-1">or click to browse</p>
        </div>
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="max-w-xl mx-auto mt-6 bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Files Selected</h2>
          {files.map((f, i) => (
            <div key={i} className="flex justify-between items-center mb-3 border p-3 rounded-lg">
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

          <button
            onClick={handleContinue}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}
    </MainLayout>
  );
}
