import { useEffect, useState } from "react";

const MediaUploader = ({ files, setFiles }) => {

  const addFiles = (newFiles) => {
    const validFiles = [];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    for (let file of newFiles) {
      // Check file type
      if (!validTypes.some(type => file.type.includes(type))) {
        alert(`File "${file.name}" has unsupported format. Please use images or videos.`);
        continue;
      }

      // Check file size
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Max 50MB allowed.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="border rounded-md p-4 space-y-4">

      {/* Dropzone */}
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="block border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted transition"
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="text-sm">
          <p className="font-medium">Drag & drop or choose files</p>
          <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, GIF, WebP, MP4, WebM (Max 50MB)</p>
        </div>
      </label>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {files.map((file, idx) => {
            const url = URL.createObjectURL(file);
            const isVideo = file.type.startsWith("video");

            return (
              <div key={idx} className="relative">
                {isVideo ? (
                  <video
                    src={url}
                    className="rounded-md h-28 w-full object-cover bg-black"
                    controls
                  />
                ) : (
                  <img
                    src={url}
                    className="rounded-md h-28 w-full object-cover"
                    alt={`Preview ${idx}`}
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 py-0.5 text-sm hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
