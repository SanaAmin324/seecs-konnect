import MainLayout from "@/layouts/MainLayout";
import DocumentProgressBar from "@/components/DocumentProgressBar";
import { useDocumentUpload } from "@/context/DocumentUploadContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { COURSE_LIST } from "@/lib/courses";
import React from "react";

export default function DocumentInfo() {
  const { data, setData } = useDocumentUpload();
  const navigate = useNavigate();

  // Track errors for each document
  const [errors, setErrors] = useState([]);

  const handleInputChange = (idx, field, value) => {
    setData(prev => ({
      ...prev,
      files: prev.files.map((f, i) => i === idx ? { ...f, [field]: value } : f)
    }));
  };

  const handleMetaChange = (idx, field, value) => {
    setData(prev => ({
      ...prev,
      files: prev.files.map((f, i) => i === idx ? { ...f, [field]: value } : f)
    }));
  };

  const validate = () => {
    const errs = data.files.map(f => {
      const e = {};
      if (!f.title) e.title = true;
      if (!f.description || f.description.length < 10) e.description = true;
      if (!f.course) e.course = true;
      // academicYear is auto-filled, do not require
      if (!f.category) e.category = true;
      return e;
    });
    setErrors(errs);
    return errs.every(e => Object.keys(e).length === 0);
  };

  const handleNext = () => {
    if (!validate()) {
      alert("Please fill all fields for each document");
      return;
    }
    navigate("/documents/review");
  };

  return (
    <MainLayout>
      <DocumentProgressBar currentStep={2} />
      <h1 className="text-2xl font-bold mb-4">Document Info</h1>
      <div className="space-y-8 max-w-xl mx-auto">
        {data.files.map((file, idx) => (
          <div key={idx} className="border rounded-xl p-4 mb-4 bg-white">
            <h2 className="font-semibold mb-2">Document {idx + 1}</h2>
            <input
              type="text"
              placeholder="Title"
              value={file.title || ""}
              onChange={e => handleInputChange(idx, "title", e.target.value)}
              className={`w-full border px-3 py-2 rounded ${errors[idx]?.title ? 'border-red-500' : ''}`}
            />
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Description</label>
              <textarea
                placeholder="Description (minimum 10 characters)"
                value={file.description || ""}
                onChange={e => handleInputChange(idx, "description", e.target.value)}
                className={`border p-2 w-full rounded ${errors[idx]?.description ? 'border-red-500' : ''}`}
              />
              <p className="text-sm text-muted-foreground">{(file.description || '').length}/10 characters</p>
              {errors[idx]?.description && <p className="text-red-600 mt-1">Description must be at least 10 characters.</p>}
            </div>
            <div className="mt-4">
              <CourseAutocomplete value={file.course} setValue={val => handleInputChange(idx, "course", val)} />
              {errors[idx]?.course && <p className="text-red-600 mt-1">Please select a course.</p>}
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Academic Year (auto)"
                value={file.academicYear || "2024"}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>
            <div className="mt-4">
              <select
                value={file.category || ""}
                onChange={e => handleInputChange(idx, "category", e.target.value)}
                className={`w-full border px-3 py-2 rounded ${errors[idx]?.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select Category</option>
                <option value="Notes">Notes</option>
                <option value="Labs">Labs</option>
                <option value="Past Papers">Past Papers</option>
                <option value="Slides">Slides</option>
              </select>
              {errors[idx]?.category && <p className="text-red-600 mt-1">Please select a category.</p>}
            </div>
          </div>
        ))}
        <button
          onClick={handleNext}
          className="w-full mt-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90"
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}

// --- Autocomplete component ---
function CourseAutocomplete({ value, setValue }) {
  const [input, setInput] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [showOptions, setShowOptions] = React.useState(false);
  const [highlightedIdx, setHighlightedIdx] = React.useState(-1);

  React.useEffect(() => {
    if (!value) setInput("");
    else {
      const found = COURSE_LIST.find(c => c.code === value);
      if (found) setInput(`${found.code} - ${found.name}`);
      else setInput(value);
    }
  }, [value]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search course (type code or name)"
        value={input}
        onChange={e => {
          const val = e.target.value;
          setInput(val);
          if (!val) {
            setOptions([]);
            setShowOptions(false);
            setValue("");
            return;
          }
          const filtered = COURSE_LIST.filter(c =>
            c.code.toLowerCase().includes(val.toLowerCase()) || c.name.toLowerCase().includes(val.toLowerCase())
          ).slice(0, 8);
          setOptions(filtered);
          setShowOptions(true);
          setHighlightedIdx(-1);
        }}
        onFocus={() => { if (input) setShowOptions(true); }}
        onBlur={() => setTimeout(() => setShowOptions(false), 150)}
        onKeyDown={e => {
          if (!showOptions || options.length === 0) return;
          if (e.key === "ArrowDown") {
            setHighlightedIdx(idx => Math.min(idx + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            setHighlightedIdx(idx => Math.max(idx - 1, 0));
          } else if (e.key === "Enter") {
            if (highlightedIdx >= 0 && highlightedIdx < options.length) {
              const opt = options[highlightedIdx];
              setInput(`${opt.code} - ${opt.name}`);
              setValue(opt.code);
              setShowOptions(false);
            } else if (options.length > 0) {
              const opt = options[0];
              setInput(`${opt.code} - ${opt.name}`);
              setValue(opt.code);
              setShowOptions(false);
            }
          }
        }}
        className="w-full border px-3 py-2 rounded"
      />
      {showOptions && options.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-border rounded-xl mt-1 shadow-lg max-h-56 overflow-auto">
          {options.map((opt, idx) => (
            <div
              key={opt.code}
              className={`px-4 py-2 cursor-pointer hover:bg-accent/20 ${highlightedIdx === idx ? 'bg-accent/10' : ''}`}
              onMouseDown={() => {
                setInput(`${opt.code} - ${opt.name}`);
                setValue(opt.code);
                setShowOptions(false);
              }}
            >
              {opt.code} - {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
