const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    filePath: { type: String, required: true }, // stored file path
    fileType: { type: String, required: true },
    course: { type: String },
    program: { type: String },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
