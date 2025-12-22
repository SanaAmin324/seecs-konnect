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
  toggleFavoriteDocument,
  getFavoriteDocuments,
} = require("../controllers/documentController");

// Upload multiple files → "files" is the field name
router.post("/upload", protect, upload.array("files", 10), uploadDocument);

// Get documents
router.get("/", protect, getDocuments);

// Get user's favorite documents
router.get("/favorites", protect, getFavoriteDocuments);

// Toggle favorite document
router.post("/:documentId/favorite", protect, toggleFavoriteDocument);

// Download one specific file in a document
router.get("/download/:id/:fileIndex", protect, downloadDocument);

// Delete document + all files
router.delete("/:id", protect, deleteDocument);

// Search
router.get("/search", protect, searchDocuments);

module.exports = router;
