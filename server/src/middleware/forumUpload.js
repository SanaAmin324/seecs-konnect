// server/src/middleware/forumUpload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/forum/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const allowedTypes = [
  // 🖼 Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",

  // 🎥 Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",

  // 📄 Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // 📦 Archives
  "application/zip",
  "application/x-zip-compressed",
];

function fileFilter(req, file, cb) {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images, videos, documents, and zip files are allowed in forum posts"
      ),
      false
    );
  }
}

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
  },
});
