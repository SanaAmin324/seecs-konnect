const express = require("express");
const router = express.Router();
const {
  getUserById,
  updateUserProfile,
  uploadProfilePicture,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getConnectionStatus,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const profileUpload = require("../middleware/profileUpload");

// Profile routes
router.get("/:userId", protect, getUserById);
router.put("/update", protect, updateUserProfile);
router.post("/upload-picture", protect, profileUpload.single("profilePicture"), uploadProfilePicture);

// Connection routes
router.post("/connect/:userId", protect, sendConnectionRequest);
router.post("/accept/:userId", protect, acceptConnectionRequest);
router.delete("/reject/:userId", protect, rejectConnectionRequest);
router.delete("/disconnect/:userId", protect, removeConnection);
router.get("/connection-status/:userId", protect, getConnectionStatus);

module.exports = router;
