const express  = require('express');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User     = require('../models/User');
const { protect } = require('../middleware/auth');
const router   = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true, token,
    user: { id: user._id, username: user.username, email: user.email,
      avatar: user.avatar, role: user.role, score: user.score,
      streak: user.streak, xp: user.xp, preferences: user.preferences }
  });
};

// POST /api/auth/register
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: 'Email or username already in use.' });
    const user = await User.create({ username, email, password });
    sendToken(user, 201, res);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' });
    user.updateStreak();
    await user.save();
    sendToken(user, 200, res);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// PATCH /api/auth/preferences
router.patch('/preferences', protect, async (req, res) => {
  try {
    const { theme, notifications, dailyGoal } = req.body;
    const user = req.user;
    if (theme) user.preferences.theme = theme;
    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (dailyGoal) user.preferences.dailyGoal = dailyGoal;
    await user.save();
    res.json({ success: true, preferences: user.preferences });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
