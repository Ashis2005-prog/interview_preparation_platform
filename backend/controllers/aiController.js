const { generateInterviewQuestions } = require("../services/aiService");

const generateQuestions = async (req, res) => {
  try {
    const { company, role, experience, difficulty, topics } = req.body;

    const result = await generateInterviewQuestions({
      company,
      role,
      experience,
      difficulty,
      topics,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("AI generation error:", error);

    return res.status(500).json({
      success: false,
      message: "AI question generation failed",
      error: error.message,
    });
  }
};

module.exports = {
  generateQuestions,
};
