const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../src/models/User");
const Notification = require("../src/models/Notification");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const cleanOrphanedNotifications = async () => {
    try {
        console.log("Cleaning orphaned notifications...");

        // Get all connection-related notifications
        const notifications = await Notification.find({
            type: { $in: ['connection_request', 'connection_accepted'] }
        }).populate('user from');

        let deletedCount = 0;

        for (const notification of notifications) {
            if (!notification.user || !notification.from) {
                // Delete if user or sender no longer exists
                await Notification.deleteOne({ _id: notification._id });
                deletedCount++;
                console.log(`Deleted notification ${notification._id} - missing user or sender`);
                continue;
            }

            const userId = notification.user._id;
            const fromId = notification.from._id;

            const user = await User.findById(userId);
            const fromUser = await User.findById(fromId);

            if (!user || !fromUser) {
                await Notification.deleteOne({ _id: notification._id });
                deletedCount++;
                console.log(`Deleted notification ${notification._id} - user deleted`);
                continue;
            }

            // Check if they are actually connected
            const areConnected = user.connections.some(id => id.toString() === fromId.toString());

            if (notification.type === 'connection_accepted' && !areConnected) {
                // Connection accepted notification but they're not connected anymore
                await Notification.deleteOne({ _id: notification._id });
                deletedCount++;
                console.log(`Deleted orphaned connection_accepted notification: ${notification.message}`);
            }

            if (notification.type === 'connection_request') {
                const hasRequest = user.connectionRequests.some(id => id.toString() === fromId.toString());
                if (!hasRequest && !areConnected) {
                    // No pending request and not connected - orphaned
                    await Notification.deleteOne({ _id: notification._id });
                    deletedCount++;
                    console.log(`Deleted orphaned connection_request notification: ${notification.message}`);
                }
            }
        }

        console.log(`\nCleaned up ${deletedCount} orphaned notifications`);
        process.exit();

    } catch (error) {
        console.error("Error cleaning notifications:", error);
        process.exit(1);
    }
};

cleanOrphanedNotifications();
