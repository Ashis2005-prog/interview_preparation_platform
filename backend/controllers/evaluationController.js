const { evaluateInterview } = require("../services/evaluationService");

const evaluate = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Interview answers are required.",
      });
    }

    const cleanedAnswers = answers.map((item) => ({
      question: item.question || "",
      answer: item.answer || "",
      topic: item.topic || "",
      difficulty: item.difficulty || "",
      type: item.type || "",

      expectedAnswer: item.expectedAnswer || "",
      keyPoints: Array.isArray(item.keyPoints) ? item.keyPoints : [],
      evaluationCriteria: Array.isArray(item.evaluationCriteria)
        ? item.evaluationCriteria
        : [],
    }));

    const evaluation = await evaluateInterview(cleanedAnswers);

    return res.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("Interview evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to evaluate interview.",
      error: error.message,
    });
  }
};

module.exports = {
  evaluate,
};
