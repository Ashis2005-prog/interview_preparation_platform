import React from "react";
import { Brain, ChevronRight } from "lucide-react";

const AIQuestionCard = ({ question, current, total, onNext }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
          Question {current} / {total}
        </span>

        <span
          className={`px-4 py-2 rounded-full ${
            question.difficulty === "Easy"
              ? "bg-green-100 text-green-700"
              : question.difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {question.difficulty}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Brain className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold">{question.topic}</h2>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <p className="text-lg leading-8">{question.question}</p>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2"
        >
          Next Question
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIQuestionCard;
