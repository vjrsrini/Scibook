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
    const { name, email, password, role, certificationLevel } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      certificationLevel: certificationLevel || 'none'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
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

// Login User
router.post('/login', async (req, res) => {
  try {
    const User = getUserModel();
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        certificationLevel: user.certificationLevel,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
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

