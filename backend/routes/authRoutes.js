const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserModel } = require('../dbHelper');
const { protect, authorize } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const User = getUserModel();
    const { name, email, username, password, role, certificationLevel } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split('@')[0] || name).trim().toLowerCase();

    // Check if user with same email or username exists
    const userExists = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername }
      ]
    });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'student',
      certificationLevel: certificationLevel || 'none'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        certificationLevel: user.certificationLevel,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User (Supports Email, Username, or Name)
router.post('/login', async (req, res) => {
  try {
    const User = getUserModel();
    const { email, username, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || username || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeIdentifier = escapeRegex(loginIdentifier);

    const user = await User.findOne({
      $or: [
        { email: new RegExp(`^${safeIdentifier}$`, 'i') },
        { username: new RegExp(`^${safeIdentifier}$`, 'i') },
        { name: new RegExp(`^${safeIdentifier}$`, 'i') },
        { email: new RegExp(`^${safeIdentifier}@`, 'i') }
      ]
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username || user.email.split('@')[0],
        email: user.email,
        role: user.role,
        certificationLevel: user.certificationLevel,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username/email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Current User Profile
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Admin: Get all users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const User = getUserModel();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update user role / certification
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const User = getUserModel();
    const { role, certificationLevel } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) user.role = role;
    if (certificationLevel) user.certificationLevel = certificationLevel;

    if (user.save) await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, certificationLevel: user.certificationLevel });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

