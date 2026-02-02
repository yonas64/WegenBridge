const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

const JWT_SECRET = process.env.JWT_SECRET;
// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('❌ User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).send(`✅ User ${user.name} registered successfully!`);
  } catch (err) {
    res.status(500).send('❌ Error registering user: ' + err.message);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('❌ Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('❌ Invalid email or password');
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       // MUST be false on localhost
      sameSite: "lax",
      maxAge: rememberMe
        ? 7 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "✅ Login successful" });
  } catch (err) {
    res.status(500).send('❌ Error logging in: ' + err.message);
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "✅ Logout successful" });
};

// Get current logged-in user
exports.getCurrentUser = async (req, res) => {
  try {
    // authMiddleware already sets req.user
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Get user profile (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).send('❌ User not found');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('❌ Error fetching profile: ' + err.message);
  }
};

// Middleware to protect routes
exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('❌ No token, authorization denied');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('❌ Token is not valid');
  }
};
