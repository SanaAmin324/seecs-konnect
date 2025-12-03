const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
  searchDocuments,
} = require("../controllers/documentController");

// Upload (protected)
router.post("/upload", protect, upload.single("file"), uploadDocument);

// Fetch documents (protected)
router.get("/", protect, getDocuments);

// Download
router.get("/download/:id", protect, downloadDocument);

// Delete
router.delete("/:id", protect, deleteDocument);

// Search
router.get("/search", protect, searchDocuments);

module.exports = router;
