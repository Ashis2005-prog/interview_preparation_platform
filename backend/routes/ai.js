const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const ChatHistory = require("../models/ChatHistory");
const axios = require("axios");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT =
  "You are PrepIQ, an expert AI interview coach for software engineers. " +
  "You specialize in Data Structures, Algorithms, System Design, and Behavioral interviews. " +
  "Be concise, practical, and use code examples when helpful. " +
  "Always mention time and space complexity for algorithm questions.";

router.post("/message", protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not set in .env" });
    }

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await axios.post(
      GROQ_URL,
      {
        model: GROQ_MODEL,
        messages: groqMessages,
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.GROQ_API_KEY,
        },
      },
    );

    const text = response.data.choices[0].message.content;
    res.json({ success: true, message: text });
  } catch (err) {
    console.error(
      "Groq error:",
      err.response ? err.response.data : err.message,
    );
    res
      .status(500)
      .json({
        error: err.response ? err.response.data.error.message : err.message,
      });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    const chats = await ChatHistory.find({
      user: req.user._id,
      isArchived: false,
    })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select("-messages");
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/history", protect, async (req, res) => {
  try {
    const chat = await ChatHistory.create({
      user: req.user._id,
      title: req.body.title || "New Chat",
    });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
