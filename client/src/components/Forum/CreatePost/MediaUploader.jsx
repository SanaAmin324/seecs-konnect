import { useEffect } from "react";

const MediaUploader = ({ files, setFiles }) => {

  const addFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
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
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        Drag & drop or choose files
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
                    className="rounded-md h-28 w-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={url}
                    className="rounded-md h-28 w-full object-cover"
                  />
                )}

                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2"
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
