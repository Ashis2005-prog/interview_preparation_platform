import React from "react";

const InterviewProgress = ({ currentQuestion, totalQuestions }) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <div className="flex justify-between mb-3">
        <span className="font-semibold">Progress</span>

        <span>
          {currentQuestion}/{totalQuestions}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default InterviewProgress;
