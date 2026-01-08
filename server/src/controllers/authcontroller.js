const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    };

    // Only include student-specific fields if not admin
    if (user.role !== "admin") {
      response.cms = user.cms;
      response.program = user.program;
      response.batch = user.batch;
      response.class = user.class;
      response.section = user.section;
      response.courses = user.courses;
    }

    res.json(response);
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  const response = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username,
    role: req.user.role,
  };

  // Only include student-specific fields if not admin
  if (req.user.role !== "admin") {
    response.cms = req.user.cms;
    response.program = req.user.program;
    response.batch = req.user.batch;
    response.class = req.user.class;
    response.section = req.user.section;
    response.courses = req.user.courses;
  }

  res.json(response);
};

module.exports = { loginUser, getUserProfile };
