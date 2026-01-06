const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    cms: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    program: String,
    batch: String,
    class: String,
    section: String,
    courses: [String],
    role: { type: String, default: "student" },
    
    // Profile fields
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    headline: { type: String, default: "", maxlength: 120 },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" }
    },
    
    // Connections and social features
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
    favoriteDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "ForumPost" }],
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
