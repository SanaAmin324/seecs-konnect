const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Notification = require("../src/models/Notification");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const clearNotifications = async () => {
    try {
        console.log("Clearing all notifications...");

        const result = await Notification.deleteMany({});
        
        console.log(`✅ Deleted ${result.deletedCount} notifications`);
        process.exit();

    } catch (error) {
        console.error("Error clearing notifications:", error);
        process.exit(1);
    }
};

clearNotifications();
