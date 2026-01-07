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
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads with proper video headers
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// Routes
app.use("/api/users", require("./Routes/userRoutes"));
app.use("/api/documents", require("./Routes/documentRoutes"));
app.use('/api/forums', require('./Routes/forumRoutes'));
app.use('/api/reports', require('./Routes/reportRoutes'));
app.use("/api/notifications", require("./Routes/notificationRoutes"));
app.use("/api/profile", require("./Routes/profileRoutes"));
app.use("/api/messages", require("./Routes/messageRoutes"));





// Test route
app.get("/", (req, res) => res.send("SEECS Konnect Backend Running"));

// Error handler - must be after routes
app.use((err, req, res, next) => {
  console.error('Error caught in error handler:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ 
    message: err.message || 'Something went wrong', 
    stack: process.env.NODE_ENV === 'production' ? null : err.stack 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
