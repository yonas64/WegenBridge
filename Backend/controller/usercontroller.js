// controllers/userController.js
const User = require('../models/users');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(`✅ User ${user.name} created successfully!`);
  } catch (err) {
    res.status(500).send('❌ Error saving user: ' + err.message);
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send('❌ Error fetching users: ' + err.message);
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('❌ User not found');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('❌ Error fetching user: ' + err.message);
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('❌ User not found');
    res.status(200).send(`✅ User ${user.name} updated successfully!`);
  } catch (err) {
    res.status(500).send('❌ Error updating user: ' + err.message);
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('❌ User not found');
    res.status(200).send(`✅ User ${user.name} deleted successfully!`);
  } catch (err) {
    res.status(500).send('❌ Error deleting user: ' + err.message);
  }
};
