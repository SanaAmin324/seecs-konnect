const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use("/api/notifications", require("./routes/notificationRoutes"));





// Test route
app.get("/", (req, res) => res.send("SEECS Konnect Backend Running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
