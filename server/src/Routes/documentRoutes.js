const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  getRecentDocuments,
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

// Get recent documents
router.get("/recent", getRecentDocuments);

// Get single document by ID
router.get("/:id", protect, getDocumentById);

// Get user's favorite documents
router.get("/favorites", protect, getFavoriteDocuments);

// Toggle favorite document
router.post("/:documentId/favorite", protect, toggleFavoriteDocument);

// Download one specific file in a document
router.get("/download/:id/:fileIndex", protect, downloadDocument);

// Serve PDF file for viewing (without download header)
router.get("/view/:id/:fileIndex", protect, async (req, res) => {
  try {
    const { id, fileIndex } = req.params;
    const Document = require('../models/Document');
    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    const file = doc.files[fileIndex];
    if (!file) return res.status(404).json({ message: "File not found" });

    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Set content type for PDF viewing
    const ext = path.extname(file.originalName).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }

    res.sendFile(path.resolve(file.filePath));
  } catch (err) {
    console.error('PDF view error:', err);
    res.status(500).json({ message: 'Failed to serve PDF' });
  }
});

// Delete document + all files
router.delete("/:id", protect, deleteDocument);

// Search
router.get("/search", protect, searchDocuments);

module.exports = router;
