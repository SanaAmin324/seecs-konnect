const Document = require("../models/Document");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Upload document (multiple files)
const uploadDocument = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "At least one file is required" });

    const { title, description, course, class: className, academicYear, category } = req.body;

    if (!title || !course) {
      return res.status(400).json({ message: "Title and course are required" });
    }

    // Prepare files array for schema
    const filesArray = req.files.map((file) => ({
      filePath: file.path,
      originalName: file.originalname,
      fileType: path.extname(file.originalname).substring(1),
    }));

    const newDoc = new Document({
      title,
      description: description || "",
      course,
      class: className || "",
      academicYear: academicYear || "",
      category: category || "",
      uploader: req.user._id,
      files: filesArray,
    });

    await newDoc.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDoc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload document" });
  }
};

// Get documents (pagination)
const getDocuments = async (req, res) => {
  const { user, page = 1, limit = 10 } = req.query;
  const filter = user ? { uploader: user } : {};
  const skip = (page - 1) * limit;

  const totalDocs = await Document.countDocuments(filter);

  const documents = await Document.find(filter)
    .populate("uploader", "name email program batch")
    .sort({ createdAt: -1 })
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

// Download a specific file from the document
const downloadDocument = async (req, res) => {
  try {
    const { id, fileIndex } = req.params; // fileIndex = which file to download
    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    const file = doc.files[fileIndex];
    if (!file) return res.status(404).json({ message: "Requested file not found" });

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    return res.download(
      path.resolve(file.filePath),
      file.originalName
    );
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Failed to download file" });
  }
};

// Delete document + all files
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (doc.uploader.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all file paths
    for (const file of doc.files) {
      if (fs.existsSync(file.filePath)) {
        await fs.promises.unlink(file.filePath);
      }
    }

    // `remove()` may not exist on newer Mongoose versions; use `deleteOne()` instead
    await doc.deleteOne();
    res.json({ message: "Document and all files deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

// Search documents
const searchDocuments = async (req, res) => {
  const { title, course, category, className, academicYear, uploaderName, page = 1, limit = 10 } =
    req.query;

  const query = {};

  if (title) query.title = { $regex: title, $options: "i" };
  if (course) query.course = { $regex: course, $options: "i" };
  if (category) query.category = { $regex: category, $options: "i" };
  if (className) query.class = { $regex: className, $options: "i" };
  if (academicYear) query.academicYear = { $regex: academicYear, $options: "i" };

  const skip = (page - 1) * limit;

  let documents = await Document.find(query)
    .populate("uploader", "name email program batch")
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit));

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
