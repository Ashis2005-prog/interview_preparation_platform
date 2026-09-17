import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

import {
  Trophy,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

const InterviewResult = () => {
  const location = useLocation();

  const evaluation = location.state?.evaluation;
  const answers = location.state?.answers || [];

  if (!evaluation) {
    return <Navigate to="/ai-interview" replace />;
  }

  const overallScore = Number(evaluation.overallScore || 0);

  const questionEvaluations = evaluation.questionEvaluations || [];

  const correctAnswers = questionEvaluations.filter(
    (item) => item.isCorrect,
  ).length;

  const totalQuestions = answers.length;

  const getPerformance = () => {
    if (overallScore >= 8) {
      return {
        title: "Excellent Performance! 🎉",
        message:
          "You demonstrated strong technical knowledge and problem-solving skills.",
      };
    }

    if (overallScore >= 6) {
      return {
        title: "Good Performance! 👍",
        message:
          "You have a solid foundation. Continue improving the weaker areas.",
      };
    }

    if (overallScore >= 4) {
      return {
        title: "Keep Practicing! 💪",
        message: "You understand some concepts, but more practice is needed.",
      };
    }

    return {
      title: "More Practice Needed",
      message:
        "Review the concepts and practice more before your next interview.",
    };
  };

  const performance = getPerformance();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Main Result Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-12 text-center">
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <Trophy size={42} />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Interview Completed
            </h1>

            <p className="mt-3 text-blue-100">{performance.title}</p>
          </div>

          <div className="px-6 py-10">
            {/* Overall Score */}
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Overall AI Score
              </p>

              <div className="mt-3 text-6xl font-bold text-slate-900">
                {overallScore.toFixed(1)}
                <span className="text-2xl text-slate-400"> / 10</span>
              </div>

              <p className="mt-3 text-slate-600">{performance.message}</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
              <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
                <CheckCircle size={32} className="text-green-600 mx-auto" />

                <p className="mt-3 text-3xl font-bold text-green-700">
                  {correctAnswers}
                </p>

                <p className="text-sm text-green-700 mt-1">Strong Answers</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
                <Target size={32} className="text-blue-600 mx-auto" />

                <p className="mt-3 text-3xl font-bold text-blue-700">
                  {totalQuestions}
                </p>

                <p className="text-sm text-blue-700 mt-1">Total Questions</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100">
                <TrendingUp size={32} className="text-purple-600 mx-auto" />

                <p className="mt-3 text-3xl font-bold text-purple-700">
                  {Math.round(overallScore * 10)}%
                </p>

                <p className="text-sm text-purple-700 mt-1">Performance</p>
              </div>
            </div>

            {/* Question Evaluations */}
            {questionEvaluations.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-5">
                  Question-wise Evaluation
                </h2>

                <div className="space-y-4">
                  {questionEvaluations.map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {item.isCorrect ? (
                            <CheckCircle className="text-green-600" />
                          ) : (
                            <XCircle className="text-red-500" />
                          )}

                          <h3 className="font-semibold text-slate-800">
                            Question {item.questionNumber || index + 1}
                          </h3>
                        </div>

                        <div className="font-bold text-blue-600">
                          {item.score}/10
                        </div>
                      </div>

                      {item.feedback && (
                        <p className="mt-4 text-slate-600">{item.feedback}</p>
                      )}

                      {item.strengths?.length > 0 && (
                        <div className="mt-4">
                          <p className="font-semibold text-green-700">
                            Strengths
                          </p>

                          <ul className="list-disc ml-5 mt-2 text-slate-600">
                            {item.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.improvements?.length > 0 && (
                        <div className="mt-4">
                          <p className="font-semibold text-orange-600">
                            Improvements
                          </p>

                          <ul className="list-disc ml-5 mt-2 text-slate-600">
                            {item.improvements.map((improvement, i) => (
                              <li key={i}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Strengths */}
            {evaluation.strengths?.length > 0 && (
              <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                  <CheckCircle size={22} />
                  Your Strengths
                </h2>

                <ul className="list-disc ml-5 mt-4 text-green-800">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {evaluation.weaknesses?.length > 0 && (
              <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
                  <XCircle size={22} />
                  Areas to Improve
                </h2>

                <ul className="list-disc ml-5 mt-4 text-red-800">
                  {evaluation.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {evaluation.improvements?.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <Lightbulb size={22} />
                  Recommended Improvements
                </h2>

                <ul className="list-disc ml-5 mt-4 text-blue-800">
                  {evaluation.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final Feedback */}
            {evaluation.feedback && (
              <div className="mt-6 bg-slate-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3">
                  AI Interview Feedback
                </h2>

                <p className="text-slate-600 leading-relaxed">
                  {evaluation.feedback}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link
                to="/ai-interview"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-md"
              >
                <RotateCcw size={18} />
                Try Again
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition"
              >
                <ArrowLeft size={18} />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
