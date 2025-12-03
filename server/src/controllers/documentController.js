const Document = require("../models/Document");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Upload document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const { title, description, course, program } = req.body;

    // Validate required fields
    if (!title || !course) {
      return res.status(400).json({ message: "Title and course are required" });
    }

    const newDoc = new Document({
      title,
      description: description || "",
      filePath: req.file.path,
      fileType: path.extname(req.file.originalname).substring(1),
      course,
      program: program || "",
      uploader: req.user._id,
    });

    await newDoc.save();
    res.status(201).json({ message: "Document uploaded successfully", document: newDoc });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload document" });
  }
};

// Fetch all documents (or per user)
// Fetch all documents (or per user) with pagination
const getDocuments = async (req, res) => {
  const { user, page = 1, limit = 10 } = req.query; // default page=1, limit=10
  const filter = user ? { uploader: user } : {};

  const skip = (page - 1) * limit; // calculate how many to skip
  const totalDocs = await Document.countDocuments(filter); // total matching documents

  const documents = await Document.find(filter)
    .populate("uploader", "name email program batch")
    .sort({ createdAt: -1 }) // newest first
    .skip(parseInt(skip))
    .limit(parseInt(limit));

  res.json({
    documents,
    page: parseInt(page),
    limit: parseInt(limit),
    totalDocs,
    totalPages: Math.ceil(totalDocs / limit),
  });
};


// Download document
const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!fs.existsSync(doc.filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(path.resolve(doc.filePath), doc.title + path.extname(doc.filePath));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Failed to download document" });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Only uploader or admin can delete
    if (doc.uploader.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this document" });
    }

    // Remove file from storage if exists
    try {
      if (fs.existsSync(doc.filePath)) {
        await fs.promises.unlink(doc.filePath);
      } else {
        console.warn(`File ${doc.filePath} not found, skipping unlink`);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ message: "Failed to delete file from storage" });
    }

    await doc.remove();
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

// Search documents
// Search documents with pagination
const searchDocuments = async (req, res) => {
  const { title, course, program, uploaderName, fileType, page = 1, limit = 10 } = req.query;

  const query = {};

  if (title) query.title = { $regex: title, $options: "i" };
  if (course) query.course = { $regex: course, $options: "i" };
  if (program) query.program = { $regex: program, $options: "i" };
  if (fileType) query.fileType = { $regex: fileType, $options: "i" };

  const skip = (page - 1) * limit;

  let documents = await Document.find(query)
    .populate("uploader", "name email program batch")
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit));

  // filter by uploader name if provided
  if (uploaderName) {
    documents = documents.filter((doc) =>
      doc.uploader.name.toLowerCase().includes(uploaderName.toLowerCase())
    );
  }

  const totalDocs = await Document.countDocuments(query);
  res.json({
    documents,
    page: parseInt(page),
    limit: parseInt(limit),
    totalDocs,
    totalPages: Math.ceil(totalDocs / limit),
  });
};

module.exports = {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
  searchDocuments,
};
