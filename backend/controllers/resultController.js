const InterviewResult = require("../models/InterviewResult");

// Save interview result
const saveResult = async (req, res) => {
  try {
    const {
      interviewType,
      overallScore,
      questionEvaluations,
      strengths,
      weaknesses,
      improvements,
      feedback,
      answers,
    } = req.body;

    if (overallScore === undefined) {
      return res.status(400).json({
        success: false,
        message: "Overall score is required",
      });
    }

    const result = await InterviewResult.create({
      user: req.user._id,

      interviewType: interviewType === "Practice" ? "Practice" : "AI Interview",

      overallScore: Number(overallScore),

      questionEvaluations: Array.isArray(questionEvaluations)
        ? questionEvaluations.map((qe, index) => ({
            ...qe,
            questionNumber: qe.questionNumber ?? index + 1,
          }))
        : [],

      strengths: Array.isArray(strengths) ? strengths : [],

      weaknesses: Array.isArray(weaknesses) ? weaknesses : [],

      improvements: Array.isArray(improvements) ? improvements : [],

      feedback: feedback || "",

      answers: Array.isArray(answers)
        ? answers.map((item) => ({
            question: item.question,
            answer: item.answer || "",
            topic: item.topic || "",
            difficulty: item.difficulty || "",
            type: item.type || "",
          }))
        : [],
    });

    return res.status(201).json({
      success: true,
      message: "Interview result saved successfully",
      result,
    });
  } catch (error) {
    console.error("Save result error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save interview result",
      error: error.message,
    });
  }
};

// Get all results for logged-in user
const getMyResults = async (req, res) => {
  try {
    const results = await InterviewResult.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Get results error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load interview results",
    });
  }
};

// Get a single result
const getResultById = async (req, res) => {
  try {
    const result = await InterviewResult.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Interview result not found",
      });
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Get result error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load interview result",
    });
  }
};

// Delete a result
const deleteResult = async (req, res) => {
  try {
    const result = await InterviewResult.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Interview result not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview result deleted successfully",
    });
  } catch (error) {
    console.error("Delete result error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete interview result",
    });
  }
};

module.exports = {
  saveResult,
  getMyResults,
  getResultById,
  deleteResult,
};
