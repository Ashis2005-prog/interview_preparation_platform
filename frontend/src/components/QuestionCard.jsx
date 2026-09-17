import React from "react";
import { Trash2, CheckCircle } from "lucide-react";

const QuestionCard = ({ question, onToggle, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between">
        <h2 className="font-bold text-lg">{question.question}</h2>

        <span
          className={`px-3 py-1 rounded-full text-sm ${
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

      <p className="mt-4 text-gray-600">{question.answer}</p>

      <div className="mt-4 flex gap-2 flex-wrap">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {question.topic}
        </span>

        {question.solved && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Solved
          </span>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onToggle(question._id)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <CheckCircle size={18} />
          Toggle
        </button>

        <button
          onClick={() => onDelete(question._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
