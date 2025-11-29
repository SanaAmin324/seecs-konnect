const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../src/models/User");  // correct path
const bcrypt = require("bcryptjs");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const seedUsers = async () => {
    try {
        console.log("Seeding users...");

        await User.deleteMany(); // Clears old users

        const hashedPassword = await bcrypt.hash("password123", 10);

        const users = [
    {
        name: "Admin User",
        cms: "000001",
        email: "admin@gmail.com",
        password: hashedPassword,   // "password123"
        program: "CS",
        batch: "2021",
        class: "A1",
        section: "S1",
        courses: [],
        role: "admin"
    },
    {
        name: "Ali Ahmed",
        cms: "388054",
        email: "388054@seecs.edu.pk",
        password: hashedPassword,
        program: "CS",
        batch: "2021",
        class: "B1",
        section: "S1",
        courses: ["DSA", "OOP", "AI"]
    },
    {
        name: "Sara Khan",
        cms: "388033",
        email: "388033@seecs.edu.pk",
        password: hashedPassword,
        program: "CS",
        batch: "2021",
        class: "B2",
        section: "S3",
        courses: ["DB", "CN", "OS"]
    }
];


        await User.insertMany(users);
        console.log("Users seeded successfully!");
        process.exit();

    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
