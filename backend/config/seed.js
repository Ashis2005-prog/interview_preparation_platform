require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Question = require('../models/Question');

const questions = [
  { title: "Two Sum", category: "Arrays", difficulty: "Easy", tags: ["hash-map","array"], companies: ["Google","Amazon","Meta"], frequency: 97, acceptanceRate: 49, description: "Given an array of integers, return indices of two numbers that add up to target.", timeComplexity: "O(n)", spaceComplexity: "O(n)" },
  { title: "Longest Substring Without Repeating Characters", category: "Strings", difficulty: "Medium", tags: ["sliding-window","string","hash-map"], companies: ["Amazon","Microsoft","Meta"], frequency: 88 },
  { title: "Median of Two Sorted Arrays", category: "Binary Search", difficulty: "Hard", tags: ["binary-search","array"], companies: ["Google","Apple"], frequency: 72 },
  { title: "Valid Parentheses", category: "Stack", difficulty: "Easy", tags: ["stack","string"], companies: ["Meta","Amazon"], frequency: 90 },
  { title: "Merge K Sorted Lists", category: "Linked List", difficulty: "Hard", tags: ["heap","linked-list"], companies: ["Google","Amazon","Uber"], frequency: 78 },
  { title: "Maximum Subarray", category: "Dynamic Programming", difficulty: "Medium", tags: ["dp","array"], companies: ["Amazon","Microsoft"], frequency: 92 },
  { title: "Binary Tree Level Order Traversal", category: "Trees", difficulty: "Medium", tags: ["bfs","tree"], companies: ["Amazon","Apple"], frequency: 85 },
  { title: "Course Schedule", category: "Graphs", difficulty: "Medium", tags: ["graph","topological-sort"], companies: ["Meta","Google"], frequency: 80 },
  { title: "LRU Cache", category: "Design", difficulty: "Medium", tags: ["hash-map","linked-list","design"], companies: ["Amazon","Google"], frequency: 87 },
  { title: "Word Search II", category: "Trie", difficulty: "Hard", tags: ["trie","backtracking"], companies: ["Google"], frequency: 70 },
  { title: "Find Median from Data Stream", category: "Heap", difficulty: "Hard", tags: ["heap","design"], companies: ["Apple","Amazon"], frequency: 74 },
  { title: "Climbing Stairs", category: "Dynamic Programming", difficulty: "Easy", tags: ["dp","fibonacci"], companies: ["Amazon","Adobe"], frequency: 93 },
  { title: "Number of Islands", category: "Graphs", difficulty: "Medium", tags: ["bfs","dfs","matrix"], companies: ["Amazon","Microsoft"], frequency: 89 },
  { title: "Longest Palindromic Substring", category: "Strings", difficulty: "Medium", tags: ["dp","string"], companies: ["Amazon","Apple"], frequency: 82 },
  { title: "Trapping Rain Water", category: "Arrays", difficulty: "Hard", tags: ["two-pointers","array"], companies: ["Google","Amazon"], frequency: 76 },
  { title: "Implement Trie", category: "Trie", difficulty: "Medium", tags: ["trie","design"], companies: ["Google","Microsoft"], frequency: 79 },
  { title: "Kth Largest Element in Array", category: "Heap", difficulty: "Medium", tags: ["heap","quick-select"], companies: ["Amazon","Google"], frequency: 83 },
  { title: "Coin Change", category: "Dynamic Programming", difficulty: "Medium", tags: ["dp","bfs"], companies: ["Amazon","Google"], frequency: 86 },
  { title: "Serialize and Deserialize Binary Tree", category: "Trees", difficulty: "Hard", tags: ["tree","bfs","design"], companies: ["Google","Meta"], frequency: 73 },
  { title: "Word Ladder", category: "Graphs", difficulty: "Hard", tags: ["bfs","graph"], companies: ["Amazon","Snap"], frequency: 68 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prepiq');
    console.log('Connected to MongoDB');
    await Question.deleteMany({});
    const inserted = await Question.insertMany(questions);
    console.log('Seeded', inserted.length, 'questions');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}
seed();
