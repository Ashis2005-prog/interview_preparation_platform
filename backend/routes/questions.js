const express  = require('express');
const router   = express.Router();
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const User     = require('../models/User');
const { protect } = require('../middleware/auth');
const Trie     = require('../algorithms/trie');
const { MinHeap } = require('../algorithms/heap');

// In-memory Trie (rebuilt on server start & after mutations)
let questionTrie = null;
let trieBuiltAt  = null;

const buildTrie = async () => {
  const questions = await Question.find({ isPublished: true });
  questionTrie = new Trie();
  for (const q of questions) {
    questionTrie.insert(q.title,    q.toObject());
    questionTrie.insert(q.category, q.toObject());
    for (const tag of q.tags) questionTrie.insert(tag, q.toObject());
    for (const co  of q.companies) questionTrie.insert(co, q.toObject());
  }
  trieBuiltAt = new Date();
  console.log(`Trie built with ${questions.length} questions`);
};

const ensureTrie = async () => {
  if (!questionTrie) await buildTrie();
};

// GET /api/questions/search?q=two&limit=8
router.get('/search', protect, async (req, res) => {
  try {
    await ensureTrie();
    const { q = '', limit = 8 } = req.query;
    if (!q.trim()) return res.json([]);
    const raw    = questionTrie.search(q, parseInt(limit) * 2);
    const unique = [...new Map(raw.map(r => [r._id?.toString() || r.id, r])).values()].slice(0, parseInt(limit));
    res.json(unique);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/questions/recommendations
router.get('/recommendations', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const solved = new Set(user.solvedProblems.map(id => id.toString()));
    const all = await Question.find({ isPublished: true });
    const unsolved = all.filter(q => !solved.has(q._id.toString()));

    const heap = new MinHeap();
    for (const q of unsolved) {
      // Lower priority number = recommended first
      // Weight: high frequency problems come first, randomize slightly
      const priority = (100 - q.frequency) + Math.random() * 10;
      heap.push(q, priority);
    }
    const recommended = heap.getTopK(6);
    res.json(recommended);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/questions
router.get('/', protect, async (req, res) => {
  try {
    const { difficulty, category, tag, company, page = 1, limit = 50, sortBy = 'frequency' } = req.query;
    const filter = { isPublished: true };
    if (difficulty) filter.difficulty = difficulty;
    if (category)   filter.category   = category;
    if (tag)        filter.tags       = { $in: [tag] };
    if (company)    filter.companies  = { $in: [company] };

    const sortMap = { frequency: { frequency: -1 }, difficulty: { difficulty: 1 }, title: { title: 1 } };
    const sort    = sortMap[sortBy] || { frequency: -1 };

    const questions = await Question.find(filter).sort(sort)
      .skip((page - 1) * limit).limit(parseInt(limit)).lean();
    const total = await Question.countDocuments(filter);

    // Attach user progress
    const user = await User.findById(req.user._id);
    const solvedSet  = new Set(user.solvedProblems.map(id => id.toString()));
    const starredSet = new Set(user.starredProblems.map(id => id.toString()));
    const withStatus = questions.map(q => ({
      ...q,
      solved:  solvedSet.has(q._id.toString()),
      starred: starredSet.has(q._id.toString()),
    }));

    res.json({ questions: withStatus, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/questions/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    res.json(q);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/questions/:id/solve
router.post('/:id/solve', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const qId  = req.params.id;
    const alreadySolved = user.solvedProblems.map(id => id.toString()).includes(qId);

    if (!alreadySolved) {
      user.solvedProblems.push(qId);
      const q = await Question.findById(qId);
      const pts = q.difficulty === 'Easy' ? 10 : q.difficulty === 'Medium' ? 20 : 40;
      user.score += pts;
      user.xp    += pts;
      await Progress.findOneAndUpdate(
        { user: user._id, question: qId },
        { status: 'solved', solvedAt: new Date(), pointsEarned: pts, $inc: { attempts: 1 } },
        { upsert: true, new: true }
      );
    } else {
      user.solvedProblems = user.solvedProblems.filter(id => id.toString() !== qId);
      await Progress.findOneAndUpdate({ user: user._id, question: qId }, { status: 'attempted' });
    }
    await user.save();
    res.json({ solved: !alreadySolved, score: user.score, xp: user.xp });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/questions/:id/star
router.post('/:id/star', protect, async (req, res) => {
  try {
    const user    = await User.findById(req.user._id);
    const qId     = req.params.id;
    const starred = user.starredProblems.map(id => id.toString()).includes(qId);
    if (!starred) user.starredProblems.push(qId);
    else user.starredProblems = user.starredProblems.filter(id => id.toString() !== qId);
    await user.save();
    res.json({ starred: !starred });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
