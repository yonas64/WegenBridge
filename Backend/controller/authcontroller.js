const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

const JWT_SECRET = "process.env.JWT_SECRET";
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('❌ Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('❌ Invalid email or password');

    const token = generateToken(user);
    res.status(200).json({ message: '✅ Login successful', token });
  } catch (err) {
    res.status(500).send('❌ Error logging in: ' + err.message);
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
