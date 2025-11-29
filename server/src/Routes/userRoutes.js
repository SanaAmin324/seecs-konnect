const express = require("express");
const router = express.Router();
const { loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public route
router.post("/login", loginUser);

// Protected route
router.get("/profile", protect, getUserProfile);

module.exports = router;
