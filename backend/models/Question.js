const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === 4;
        },
        message: "A question must have exactly 4 options",
      },
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      enum: [
        "DSA",
        "Java",
        "C++",
        "Python",
        "JavaScript",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "OOP",
        "SQL",
        "Aptitude",
      ],
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Question", questionSchema);
