const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// sign token
const signToken = (id, role, status) =>
  jwt.sign({ id, role, status }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      token: signToken(user._id, user.role, user.status),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid User or Email' });

    const token = signToken(user._id, user.role, user.status);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: 'Missing Google account info' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash(googleId, 10); // safer dummy password

      user = await User.create({
        name,
        email,
        password: randomPassword,
        googleId,
        avatar,
        role: 'Customer',
        provider: 'google',
      });
    }

    const token = signToken(user._id, user.role, user.status);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Google Register / OAuth
exports.googleOAuth = async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash('google_oauth_user_' + Date.now(), 10);

      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: 'Customer',
        provider: 'google',
      });
    }

    const token = signToken(user._id, user.role, user.status);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
};
