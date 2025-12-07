const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  originalName: { type: String, required: true },
});

const documentSchema = new mongoose.Schema(
  {
    files: { type: [fileSchema], required: true }, // multiple files

    title: { type: String, required: true },
    description: { type: String },

    course: { type: String },
    class: { type: String },
    academicYear: { type: String },
    category: { type: String },

    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
