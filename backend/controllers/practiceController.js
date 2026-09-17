const { generatePracticeQuestions } = require("../services/aiService");

const generatePractice = async (req, res) => {
  try {
    const { subject = "All", difficulty = "Medium", count = 10 } = req.body;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    const result = await generatePracticeQuestions({
      subject,
      difficulty,
      count,
    });

    return res.status(200).json({
      success: true,
      count: result.questions.length,
      questions: result.questions,
    });
  } catch (error) {
    console.error("Practice generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate practice questions",
      error: error.message,
    });
  }
};

module.exports = {
  generatePractice,
};
