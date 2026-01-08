const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../src/models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

/**
 * This script helps migrate existing users by adding usernames
 * Run this if you already have users in your database without usernames
 */
const addUsernamesToExistingUsers = async () => {
    try {
        console.log("Starting username migration...");

        // Find all users without a username
        const usersWithoutUsername = await User.find({ 
            $or: [
                { username: { $exists: false } },
                { username: null },
                { username: "" }
            ]
        });

        if (usersWithoutUsername.length === 0) {
            console.log("All users already have usernames!");
            process.exit(0);
        }

        console.log(`Found ${usersWithoutUsername.length} users without usernames.`);

        // Function to generate username from name or email
        const generateUsername = (user) => {
            // Try to create username from name
            let baseUsername = user.name
                .toLowerCase()
                .replace(/\s+/g, '_') // Replace spaces with underscores
                .replace(/[^a-z0-9_.]/g, ''); // Remove invalid characters

            // If username is too short, use CMS or email
            if (baseUsername.length < 3) {
                if (user.cms) {
                    baseUsername = 'user_' + user.cms;
                } else {
                    baseUsername = user.email.split('@')[0].toLowerCase();
                }
            }

            // Ensure it's within length limits
            if (baseUsername.length > 30) {
                baseUsername = baseUsername.substring(0, 30);
            }

            return baseUsername;
        };

        // Check if username already exists
        const isUsernameAvailable = async (username) => {
            const existing = await User.findOne({ username });
            return !existing;
        };

        // Generate unique username by adding numbers if needed
        const generateUniqueUsername = async (baseUsername) => {
            let username = baseUsername;
            let counter = 1;

            while (!(await isUsernameAvailable(username))) {
                username = `${baseUsername}${counter}`;
                counter++;
            }

            return username;
        };

        // Update each user
        let successCount = 0;
        let errorCount = 0;

        for (const user of usersWithoutUsername) {
            try {
                const baseUsername = generateUsername(user);
                const uniqueUsername = await generateUniqueUsername(baseUsername);

                user.username = uniqueUsername;
                await user.save();

                console.log(`✓ Updated user "${user.name}" with username: @${uniqueUsername}`);
                successCount++;
            } catch (error) {
                console.error(`✗ Failed to update user "${user.name}":`, error.message);
                errorCount++;
            }
        }

        console.log("\n=== Migration Summary ===");
        console.log(`Successfully updated: ${successCount} users`);
        console.log(`Failed: ${errorCount} users`);
        console.log("Migration complete!");

        process.exit(0);

    } catch (error) {
        console.error("Migration error:", error);
        process.exit(1);
    }
};

addUsernamesToExistingUsers();
