const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    topic: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const questionEvaluationSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    feedback: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const interviewResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // AI Interview or Practice
    interviewType: {
      type: String,
      enum: ["AI Interview", "Practice"],
      default: "AI Interview",
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    questionEvaluations: {
      type: [questionEvaluationSchema],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    feedback: {
      type: String,
      default: "",
    },

    answers: {
      type: [answerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InterviewResult", interviewResultSchema);
