const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const { protect } = require('../middleware/auth');
const Graph    = require('../algorithms/graph');

const ROADMAP_NODES = {
  "basics":       { label: "Programming Basics",    level: 0, color: "#4ade80", desc: "Variables, loops, functions, OOP", estimatedHours: 20 },
  "ds-arrays":    { label: "Arrays & Strings",      level: 1, color: "#60a5fa", desc: "Sliding window, two pointers",     estimatedHours: 15 },
  "ds-linked":    { label: "Linked Lists",          level: 1, color: "#60a5fa", desc: "Singly, doubly, circular",         estimatedHours: 10 },
  "ds-stack":     { label: "Stacks & Queues",       level: 2, color: "#a78bfa", desc: "LIFO/FIFO, monotonic stack",       estimatedHours: 8  },
  "ds-tree":      { label: "Trees & BST",           level: 2, color: "#a78bfa", desc: "Traversals, BST operations",       estimatedHours: 15 },
  "ds-heap":      { label: "Heaps & Priority Queue",level: 3, color: "#f472b6", desc: "Min/Max heap, K-th element",       estimatedHours: 10 },
  "ds-graph":     { label: "Graphs",               level: 3, color: "#f472b6", desc: "BFS, DFS, shortest paths",         estimatedHours: 20 },
  "ds-trie":      { label: "Trie",                 level: 3, color: "#f472b6", desc: "Prefix trees, autocomplete",       estimatedHours: 8  },
  "algo-sort":    { label: "Sorting Algorithms",   level: 2, color: "#fb923c", desc: "Quick, merge, heap sort",          estimatedHours: 8  },
  "algo-search":  { label: "Binary Search",        level: 2, color: "#fb923c", desc: "Search on answer, rotated arrays", estimatedHours: 10 },
  "algo-dp":      { label: "Dynamic Programming",  level: 4, color: "#facc15", desc: "Memoization, tabulation, LCS, knapsack", estimatedHours: 30 },
  "algo-greedy":  { label: "Greedy Algorithms",    level: 4, color: "#facc15", desc: "Interval scheduling, Huffman",     estimatedHours: 12 },
  "backtrack":    { label: "Backtracking",         level: 4, color: "#facc15", desc: "N-queens, permutations, subsets",  estimatedHours: 12 },
  "system-design":{ label: "System Design",        level: 5, color: "#34d399", desc: "Scalability, databases, caching",  estimatedHours: 40 },
  "behavioral":   { label: "Behavioral",           level: 5, color: "#38bdf8", desc: "STAR method, leadership stories",  estimatedHours: 10 },
};

const ROADMAP_EDGES = [
  ["basics","ds-arrays"], ["basics","ds-linked"],
  ["ds-arrays","ds-stack"], ["ds-linked","ds-stack"],
  ["ds-stack","ds-tree"], ["ds-arrays","algo-sort"], ["ds-arrays","algo-search"],
  ["ds-tree","ds-heap"], ["ds-tree","ds-graph"], ["ds-tree","ds-trie"],
  ["algo-search","algo-dp"], ["algo-sort","algo-dp"],
  ["ds-graph","algo-greedy"], ["ds-tree","backtrack"],
  ["algo-dp","system-design"], ["algo-greedy","system-design"],
  ["backtrack","algo-dp"], ["system-design","behavioral"],
];

const buildRoadmapGraph = () => {
  const g = new Graph();
  for (const [id, data] of Object.entries(ROADMAP_NODES)) g.addNode(id, data);
  for (const [from, to] of ROADMAP_EDGES) g.addEdge(from, to);
  return g;
};

// GET /api/roadmap
router.get('/', protect, async (req, res) => {
  try {
    const graph     = buildRoadmapGraph();
    const topoOrder = graph.topologicalSort();
    const user      = await User.findById(req.user._id);
    const completed = new Set(user.completedRoadmapNodes || []);

    // Group by level for frontend rendering
    const byLevel = {};
    for (const { id, data } of topoOrder) {
      const lvl = data.level;
      if (!byLevel[lvl]) byLevel[lvl] = [];
      const prereqs = ROADMAP_EDGES.filter(([,to]) => to === id).map(([from]) => from);
      byLevel[lvl].push({
        id, ...data,
        completed: completed.has(id),
        unlocked:  prereqs.length === 0 || prereqs.every(p => completed.has(p)),
        prerequisites: prereqs,
      });
    }

    const totalHours    = Object.values(ROADMAP_NODES).reduce((s,n) => s + n.estimatedHours, 0);
    const completedHrs  = [...completed].reduce((s,id) => s + (ROADMAP_NODES[id]?.estimatedHours || 0), 0);

    res.json({
      byLevel,
      completedNodes: [...completed],
      stats: { total: Object.keys(ROADMAP_NODES).length, completed: completed.size, totalHours, completedHours: completedHrs }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/roadmap/complete/:nodeId
router.post('/complete/:nodeId', protect, async (req, res) => {
  try {
    const user   = await User.findById(req.user._id);
    const nodeId = req.params.nodeId;
    if (!ROADMAP_NODES[nodeId]) return res.status(404).json({ error: 'Node not found' });

    const idx = user.completedRoadmapNodes.indexOf(nodeId);
    if (idx === -1) user.completedRoadmapNodes.push(nodeId);
    else user.completedRoadmapNodes.splice(idx, 1);

    await user.save();
    res.json({ success: true, completedNodes: user.completedRoadmapNodes });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/roadmap/path/:from/:to — Shortest learning path
router.get('/path/:from/:to', protect, (req, res) => {
  try {
    const graph = buildRoadmapGraph();
    const { distances, previous } = graph.dijkstra(req.params.from);
    const path  = graph.getPath(previous, req.params.to);
    res.json({ path: path.map(id => ({ id, ...ROADMAP_NODES[id] })), distance: distances[req.params.to] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
