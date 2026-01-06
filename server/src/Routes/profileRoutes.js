const express = require("express");
const router = express.Router();
const {
  getUserById,
  updateUserProfile,
  uploadProfilePicture,
  removeProfilePicture,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
  getUserConnections,
  getConnectionStatus,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const profileUpload = require("../middleware/profileUpload");

// Profile routes - specific routes BEFORE parameterized routes
router.put("/update", protect, updateUserProfile);
router.post(
  "/upload-picture", 
  protect, 
  (req, res, next) => {
    profileUpload.single("profilePicture")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message || "File upload error" });
      }
      next();
    });
  },
  uploadProfilePicture
);
router.delete("/remove-picture", protect, removeProfilePicture);

// Connection routes - specific routes BEFORE parameterized routes
router.get("/connections", protect, getUserConnections);
router.get("/connections/:userId", protect, getUserConnections);
router.get("/connection-status/:userId", protect, getConnectionStatus);
router.post("/connect/:userId", protect, sendConnectionRequest);
router.post("/accept/:userId", protect, acceptConnectionRequest);
router.delete("/reject/:userId", protect, rejectConnectionRequest);
router.delete("/cancel-request/:userId", protect, cancelConnectionRequest);
router.delete("/disconnect/:userId", protect, removeConnection);

// Parameterized route LAST
router.get("/:userId", protect, getUserById);

module.exports = router;
