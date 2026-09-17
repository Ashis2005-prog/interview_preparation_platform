const Question = require("../models/Question");

// ==========================================
// GET QUESTIONS
// GET /api/questions
// ==========================================

const getQuestions = async (req, res) => {
  try {
    const { subject, difficulty, limit = 10 } = req.query;

    const filter = {};

    if (subject && subject !== "All") {
      filter.subject = subject;
    }

    if (difficulty && difficulty !== "All") {
      filter.difficulty = difficulty;
    }

    const questions = await Question.find(filter)
      .select("-answer -explanation")
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load questions",
    });
  }
};

// ==========================================
// GET SINGLE QUESTION
// GET /api/questions/:id
// ==========================================

const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).select(
      "-answer -explanation",
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Get question error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load question",
    });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
};
