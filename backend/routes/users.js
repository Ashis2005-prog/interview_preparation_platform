const express   = require('express');
const router    = express.Router();
const User      = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users/leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('username avatar score streak xp')
      .sort({ score: -1 }).limit(10);
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/users/profile
router.patch('/profile', protect, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (username) user.username = username;
    if (avatar)   user.avatar   = avatar;
    await user.save();
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
