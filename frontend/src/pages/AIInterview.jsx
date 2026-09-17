import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import AIConfigForm from "../components/AIConfigForm";
import LoadingInterview from "../components/LoadingInterview";
import AIQuestionCard from "../components/AIQuestionCard";

import InterviewTimer from "../components/InterviewTimer";
import InterviewProgress from "../components/InterviewProgress";
import AnswerRecorder from "../components/AnswerRecorder";

import { generateQuestions } from "../services/aiService";
import { evaluateInterview } from "../services/evaluationService";
import { saveInterviewResult } from "../services/resultService";

const AIInterview = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [error, setError] = useState("");

  const handleGenerate = async (config) => {
    try {
      setError("");
      setLoading(true);

      const data = await generateQuestions(config);

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions were generated.");
      }

      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers([]);
      setCurrentAnswer("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to generate interview questions.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Creates the complete answer object required for evaluation
  const createAnswerObject = (index, answer) => {
    const question = questions[index];

    return {
      question: question.question,
      answer: answer?.trim() || "",

      topic: question.topic || "",
      difficulty: question.difficulty || "",
      type: question.type || "",

      expectedAnswer: question.expectedAnswer || "",
      keyPoints: question.keyPoints || [],
      evaluationCriteria: question.evaluationCriteria || [],
    };
  };

  const handleSaveAnswer = (answer) => {
    setCurrentAnswer(answer);

    setAnswers((previousAnswers) => {
      const updatedAnswers = [...previousAnswers];

      updatedAnswers[currentIndex] = createAnswerObject(currentIndex, answer);

      return updatedAnswers;
    });
  };

  const submitInterview = async (finalAnswers) => {
    try {
      setEvaluating(true);
      setError("");

      const result = await evaluateInterview(finalAnswers);

      if (!result.success || !result.evaluation) {
        throw new Error("Invalid evaluation response.");
      }

      const evaluation = result.evaluation;

      const saveResponse = await saveInterviewResult({
        overallScore: evaluation.overallScore,

        questionEvaluations: evaluation.questionEvaluations || [],

        strengths: evaluation.strengths || [],
        weaknesses: evaluation.weaknesses || [],
        improvements: evaluation.improvements || [],
        feedback: evaluation.feedback || "",

        answers: finalAnswers,
      });

      if (!saveResponse.success) {
        throw new Error("Failed to save interview result.");
      }

      navigate("/interview-result", {
        state: {
          evaluation,
          answers: finalAnswers,
          resultId: saveResponse.result?._id,
        },
      });
    } catch (error) {
      console.error("Evaluation error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to evaluate the interview. Please try again.",
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      setError("Please write an answer before continuing.");
      return;
    }

    setError("");

    const updatedAnswers = [...answers];

    updatedAnswers[currentIndex] = createAnswerObject(
      currentIndex,
      currentAnswer,
    );

    setAnswers(updatedAnswers);

    if (currentIndex + 1 >= questions.length) {
      submitInterview(updatedAnswers);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setCurrentAnswer("");
  };

  const handleTimeUp = () => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentIndex] = createAnswerObject(
      currentIndex,
      currentAnswer,
    );

    setAnswers(updatedAnswers);

    submitInterview(updatedAnswers);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">AI Mock Interview</h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                {error}
              </div>
            )}

            {!loading && !evaluating && questions.length === 0 && (
              <AIConfigForm onGenerate={handleGenerate} />
            )}

            {loading && <LoadingInterview />}

            {evaluating && (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg">
                  <div className="animate-spin mx-auto w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full" />

                  <h2 className="text-3xl font-bold mt-6">
                    AI is Evaluating Your Interview
                  </h2>

                  <p className="text-gray-500 mt-3">
                    Please wait while AI analyzes your answers and performance.
                  </p>
                </div>
              </div>
            )}

            {!loading && !evaluating && questions.length > 0 && (
              <div className="space-y-6">
                <InterviewTimer duration={300} onTimeUp={handleTimeUp} />

                <InterviewProgress
                  currentQuestion={currentIndex + 1}
                  totalQuestions={questions.length}
                />

                <AIQuestionCard
                  question={questions[currentIndex]}
                  current={currentIndex + 1}
                  total={questions.length}
                />

                <AnswerRecorder
                  value={currentAnswer}
                  onSave={handleSaveAnswer}
                />

                <button
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer.trim()}
                  className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    disabled:bg-gray-400
                    text-white
                    font-semibold
                    py-4
                    rounded-xl
                    transition
                  "
                >
                  {currentIndex + 1 === questions.length
                    ? "Submit Interview"
                    : "Next Question"}
                </button>

                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-sm text-gray-500">Answer status</p>

                  <p className="font-semibold mt-1">
                    {currentAnswer
                      ? "Answer recorded ✓"
                      : "No answer recorded yet"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIInterview;
