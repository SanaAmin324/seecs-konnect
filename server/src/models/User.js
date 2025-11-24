import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cms: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  program: String,
  batch: String,
  class: String,
  section: String,
  courses: [String],
  role: { type: String, enum: ["student", "admin"], default: "student" }
});

export default mongoose.model("User", userSchema);
