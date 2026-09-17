const express = require("express");
const Trie = require("../utils/trie");
const Question = require("../models/Question");

const router = express.Router();

let trie = new Trie();

const indexQuestions = async () => {
  try {
    const questions = await Question.find(
      { question: { $type: "string", $ne: "" } },
      "question topic",
    ).lean();

    const nextTrie = new Trie();

    for (const item of questions) {
      nextTrie.insert(item.question);
    }

    trie = nextTrie;

    console.log(`Indexed ${questions.length} questions for search`);
  } catch (error) {
    console.error("Question indexing failed:", error.message);
  }
};

indexQuestions();

router.get("/autocomplete", async (req, res) => {
  try {
    const { prefix } = req.query;

    if (!prefix || typeof prefix !== "string") {
      return res.json({ suggestions: [] });
    }

    const suggestions = trie.startsWith(prefix);

    return res.json({
      suggestions: suggestions.slice(0, 10),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Autocomplete failed",
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query, topic, difficulty } = req.query;

    const filter = {};

    if (query && typeof query === "string") {
      filter.question = { $regex: query.trim(), $options: "i" };
    }

    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .lean();

    return res.json(questions);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
});

module.exports = router;
