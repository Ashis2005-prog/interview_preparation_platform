import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";

const Practice = () => {
  const [subject, setSubject] = useState("All");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const subjects = [
    "All",
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
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  // ==========================================
  // GENERATE PRACTICE
  // ==========================================

  const startPractice = async () => {
    try {
      setLoading(true);
      setError("");

      setQuestions([]);
      setAnswers([]);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setFinished(false);
      setScore(0);

      const response = await api.post("/questions/generate", {
        subject,
        difficulty,
        count: questionCount,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to generate questions",
        );
      }

      const generatedQuestions = response.data.questions;

      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("No questions were generated");
      }

      setQuestions(generatedQuestions);
    } catch (err) {
      console.error("Practice generation error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate practice questions",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SELECT ANSWER
  // ==========================================

  const selectAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = index;
      return updated;
    });
  };

  // ==========================================
  // NEXT QUESTION
  // ==========================================

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    if (currentQuestion === questions.length - 1) {
      finishPractice();
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  // ==========================================
  // FINISH PRACTICE
  // ==========================================

  const finishPractice = async () => {
    try {
      setLoading(true);
      setError("");

      // Create a final copy including the current answer.
      const finalAnswers = [...answers];

      finalAnswers[currentQuestion] = selectedAnswer;

      // Calculate score
      let correct = 0;

      questions.forEach((question, index) => {
        if (finalAnswers[index] === question.answer) {
          correct++;
        }
      });

      const percentage = Math.round((correct / questions.length) * 100);

      // Progress system stores score out of 10
      const overallScore = Number(
        ((correct / questions.length) * 10).toFixed(1),
      );

      // Prepare answers for database
      const savedAnswers = questions.map((question, index) => {
        const selectedIndex = finalAnswers[index];

        return {
          question: question.question,
          answer:
            selectedIndex !== undefined && selectedIndex !== null
              ? question.options[selectedIndex]
              : "",
          topic: question.topic || subject,
          difficulty: question.difficulty || difficulty,
          type: "MCQ",
        };
      });

      // Prepare evaluation data
      const questionEvaluations = questions.map((question, index) => {
        const selectedIndex = finalAnswers[index];

        return {
          question: question.question,
          answer:
            selectedIndex !== undefined && selectedIndex !== null
              ? question.options[selectedIndex]
              : "",
          expectedAnswer:
            question.options?.[question.answer] || question.answer,
          isCorrect: selectedIndex === question.answer,
          topic: question.topic || subject,
          difficulty: question.difficulty || difficulty,
        };
      });

      // Generate basic feedback
      const strengths = [];

      if (percentage >= 80) {
        strengths.push("Strong performance in the practice test.");
      } else if (percentage >= 60) {
        strengths.push("Good understanding of the tested concepts.");
      }

      const weaknesses = [];

      if (percentage < 60) {
        weaknesses.push("Some concepts need more practice and revision.");
      }

      const improvements = [
        "Review the questions answered incorrectly.",
        `Continue practicing ${subject === "All" ? "multiple subjects" : subject}.`,
        `Practice more ${difficulty.toLowerCase()} level questions.`,
      ];

      const feedback = `You scored ${correct} out of ${questions.length} questions (${percentage}%).`;

      // ==========================================
      // SAVE TO DATABASE
      // ==========================================

      const response = await api.post("/results", {
        overallScore,
        strengths,
        weaknesses,
        improvements,
        feedback,
        answers: savedAnswers,
        questionEvaluations,

        // Identifies this result as Practice
        interviewType: "Practice",
      });

      console.log("Practice result saved:", response.data);

      // Update local React state
      setAnswers(finalAnswers);
      setScore(correct);
      setFinished(true);
    } catch (err) {
      console.error("Failed to save practice result:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Practice completed, but the result could not be saved.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESET PRACTICE
  // ==========================================

  const resetPractice = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setFinished(false);
    setScore(0);
    setError("");
  };

  // ==========================================
  // RESULT SCREEN
  // ==========================================

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
              <Trophy className="h-10 w-10 text-yellow-600" />
            </div>

            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              Practice Complete!
            </h1>

            <p className="mb-8 text-gray-500">
              You completed an AI-generated practice test.
            </p>

            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-blue-50 p-5">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-3xl font-bold text-blue-600">
                  {score}/{questions.length}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-5">
                <p className="text-sm text-gray-500">Percentage</p>
                <p className="text-3xl font-bold text-green-600">
                  {percentage}%
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-5">
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="text-xl font-bold text-purple-600">
                  {difficulty}
                </p>
              </div>
            </div>

            <button
              onClick={resetPractice}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <RotateCcw size={18} />
              Start Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // QUESTION SCREEN
  // ==========================================

  if (questions.length > 0) {
    const question = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {subject} • {difficulty}
              </p>

              <h1 className="text-2xl font-bold text-gray-900">
                AI Practice Test
              </h1>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <span className="font-semibold text-blue-600">
                {currentQuestion + 1}
              </span>

              <span className="text-gray-400"> / {questions.length}</span>
            </div>
          </div>

          {/* Progress */}

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question */}

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-blue-600">
                Question {currentQuestion + 1}
              </p>

              <h2 className="text-xl font-semibold leading-relaxed text-gray-900">
                {question.question}
              </h2>
            </div>

            <div className="space-y-4">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = question.answer === index;

                let optionClass =
                  "border-gray-200 hover:border-blue-400 hover:bg-blue-50";

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    optionClass = "border-green-500 bg-green-50 text-green-800";
                  } else if (isSelected) {
                    optionClass = "border-red-500 bg-red-50 text-red-800";
                  } else {
                    optionClass = "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else if (isSelected) {
                  optionClass = "border-blue-500 bg-blue-50 text-blue-700";
                }

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${optionClass}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="flex-1">{option}</span>

                    {selectedAnswer !== null && isCorrect && (
                      <CheckCircle className="text-green-600" size={22} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}

            {selectedAnswer !== null && question.explanation && (
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="mb-1 font-semibold text-blue-700">Explanation</p>

                <p className="text-sm leading-relaxed text-gray-700">
                  {question.explanation}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={nextQuestion}
                disabled={selectedAnswer === null || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving Result...
                  </>
                ) : (
                  <>
                    {currentQuestion === questions.length - 1
                      ? "Finish Test"
                      : "Next Question"}

                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // START SCREEN
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Practice</h1>

          <p className="mt-2 text-gray-500">
            Generate fresh interview questions using AI.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />

            <div>
              <p className="font-semibold">Could not generate questions</p>

              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <BookOpen className="text-blue-600" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Generate Practice Test
              </h2>

              <p className="text-sm text-gray-500">
                Gemini will create new questions for every test.
              </p>
            </div>
          </div>

          {/* Subject */}

          <div className="mb-8">
            <label className="mb-3 block font-semibold text-gray-800">
              Subject
            </label>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {subjects.map((item) => (
                <button
                  key={item}
                  onClick={() => setSubject(item)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                    subject === item
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}

          <div className="mb-8">
            <label className="mb-3 block font-semibold text-gray-800">
              Difficulty
            </label>

            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((item) => (
                <button
                  key={item}
                  onClick={() => setDifficulty(item)}
                  className={`rounded-xl border-2 px-4 py-3 font-medium transition ${
                    difficulty === item
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}

          <div className="mb-8">
            <label className="mb-3 block font-semibold text-gray-800">
              Number of Questions
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 20].map((number) => (
                <button
                  key={number}
                  onClick={() => setQuestionCount(number)}
                  className={`rounded-xl border-2 px-4 py-3 font-medium transition ${
                    questionCount === number
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {number} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Start */}

          <button
            onClick={startPractice}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating Questions...
              </>
            ) : (
              <>
                <Trophy size={20} />
                Generate Practice Test
              </>
            )}
          </button>

          {loading && (
            <p className="mt-4 text-center text-sm text-gray-500">
              AI is creating {questionCount} unique {difficulty.toLowerCase()}{" "}
              questions. This may take a few seconds.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
