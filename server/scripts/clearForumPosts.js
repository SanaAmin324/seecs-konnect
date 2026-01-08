const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ForumPost = require("../src/models/ForumPost");
const Comment = require("../src/models/Comment");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const clearForumData = async () => {
    try {
        console.log("Clearing forum posts and comments...");

        await ForumPost.deleteMany();
        await Comment.deleteMany();

        console.log("✅ All forum posts and comments cleared successfully!");
        console.log("You can now create new posts with the new user accounts.");
        
        process.exit(0);
    } catch (error) {
        console.error("Error clearing forum data:", error);
        process.exit(1);
    }
};

clearForumData();
