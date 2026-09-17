import React from "react";
import { Calendar, ChevronRight, Trophy, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InterviewHistoryCard = ({ result }) => {
  const navigate = useNavigate();

  const score = Number(result.overallScore || 0);

  const isPractice = result.interviewType === "Practice";

  const getScoreStyle = () => {
    if (score >= 8) {
      return "bg-green-100 text-green-700";
    }

    if (score >= 5) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  const questionCount = Array.isArray(result.answers)
    ? result.answers.length
    : Array.isArray(result.questionEvaluations)
      ? result.questionEvaluations.length
      : 0;

  const subject = isPractice ? result.answers?.[0]?.topic : null;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Icon */}
          <div
            className={`p-3 rounded-xl ${
              isPractice
                ? "bg-purple-100 text-purple-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {isPractice ? <BookOpen size={22} /> : <Trophy size={22} />}
          </div>

          {/* Information */}
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900">
              {isPractice ? "Practice MCQ Test" : "AI Mock Interview"}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
              {/* Date */}
              <span className="flex items-center gap-1">
                <Calendar size={15} />

                {new Date(result.createdAt).toLocaleDateString()}
              </span>

              {/* Question Count */}
              {questionCount > 0 && <span>{questionCount} Questions</span>}

              {/* Subject */}
              {subject && <span>{subject}</span>}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Score */}
          <span
            className={`px-4 py-2 rounded-full font-bold ${getScoreStyle()}`}
          >
            {score.toFixed(1)}/10
          </span>

          {/* View Result */}
          <button
            onClick={() => navigate(`/progress/${result._id}`)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            title="View result"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewHistoryCard;
