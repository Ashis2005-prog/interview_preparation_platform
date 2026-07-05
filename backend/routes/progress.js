const express    = require('express');
const router     = express.Router();
const User       = require('../models/User');
const Progress   = require('../models/Progress');
const { protect }= require('../middleware/auth');

// GET /api/progress/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const allProgress = await Progress.find({ user: req.user._id }).populate('question');

    const solved   = allProgress.filter(p => p.status === 'solved');
    const byDiff   = { Easy: 0, Medium: 0, Hard: 0 };
    const byCat    = {};
    let totalTime  = 0;

    for (const p of solved) {
      if (p.question) {
        byDiff[p.question.difficulty] = (byDiff[p.question.difficulty] || 0) + 1;
        byCat[p.question.category]    = (byCat[p.question.category]    || 0) + 1;
        totalTime += p.timeSpent || 0;
      }
    }

    res.json({
      totalSolved:    solved.length,
      totalAttempted: allProgress.filter(p => p.status === 'attempted').length,
      byDifficulty:   byDiff,
      byCategory:     byCat,
      totalTimeSpent: totalTime,
      score:          user.score,
      xp:             user.xp,
      streak:         user.streak,
      maxStreak:      user.maxStreak,
      achievements:   user.achievements,
      activityLog:    user.activityLog.slice(-30),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/progress/activity — last 7 days
router.get('/activity', protect, async (req, res) => {
  try {
    const user  = await User.findById(req.user._id);
    const days  = [];
    for (let i = 6; i >= 0; i--) {
      const d    = new Date(Date.now() - i * 86400000);
      const date = d.toISOString().split('T')[0];
      const log  = user.activityLog.find(a => a.date === date);
      days.push({ date, count: log?.count || 0, day: d.toLocaleDateString('en',{weekday:'short'}) });
    }
    res.json(days);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/progress/log — record daily activity
router.post('/log', protect, async (req, res) => {
  try {
    const user  = await User.findById(req.user._id);
    const today = new Date().toISOString().split('T')[0];
    const entry = user.activityLog.find(a => a.date === today);
    if (entry) entry.count++;
    else user.activityLog.push({ date: today, count: 1 });
    await user.save();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
