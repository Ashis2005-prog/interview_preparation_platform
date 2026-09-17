const express = require("express");

const {
  getQuestions,
  getQuestion,
} = require("../controllers/questionController");

const { generatePractice } = require("../controllers/practiceController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// AI-generated practice questions
router.post("/generate", generatePractice);

// Existing database questions
router.get("/", getQuestions);

router.get("/:id", getQuestion);

module.exports = router;
