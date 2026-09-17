import React from "react";
import { Trophy } from "lucide-react";

const ScoreCard = ({ score = 0 }) => {
  const percentage = Math.min(Math.max(score * 10, 0), 100);

  const getScoreLabel = () => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-gray-200"
            />

            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 3.14} 314`}
              className="text-blue-600"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{score}/10</span>

            <span className="text-sm text-gray-500">Score</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5">
          <Trophy className="text-yellow-500" />

          <h2 className="text-2xl font-bold">{getScoreLabel()}</h2>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
