const User = require('../models/users');
const MissingPerson = require('../models/missingPerson.model');
const Sighting = require('../models/sighting.model');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(`User ${user.name} created successfully`);
  } catch (err) {
    res.status(500).send('Error saving user: ' + err.message);
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send('Error fetching users: ' + err.message);
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('Error fetching user: ' + err.message);
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.status(200).send(`User ${user.name} updated successfully`);
  } catch (err) {
    res.status(500).send('Error updating user: ' + err.message);
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).send(`User ${user.name} deleted successfully`);
  } catch (err) {
    res.status(500).send('Error deleting user: ' + err.message);
  }
};

// Get logged-in user's profile with their reports
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, missingPersons, sightings] = await Promise.all([
      User.findById(userId).select('-password'),
      MissingPerson.find({ createdBy: userId }).sort({ createdAt: -1 }),
      Sighting.find({ reportedBy: userId })
        .populate('missingPerson', 'name status photoUrl')
        .sort({ createdAt: -1 }),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user,
      missingPersons,
      sightings,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// Update logged-in user's basic profile information
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (age !== undefined && age !== "") updates.age = Number(age);

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user._id },
      });

      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      updates.email = normalizedEmail;
    }

    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
