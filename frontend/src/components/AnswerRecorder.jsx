import React from "react";

const AnswerRecorder = ({ value, onSave }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
      <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Your Answer
      </label>

      <textarea
        value={value}
        onChange={(e) => onSave(e.target.value)}
        placeholder="Type your answer here..."
        rows={8}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-slate-600
          bg-white
          dark:bg-slate-900
          text-gray-900
          dark:text-white
          placeholder-gray-400
          p-4
          outline-none
          focus:ring-2
          focus:ring-blue-500
          resize-none
        "
      />

      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {value.length} characters
      </div>
    </div>
  );
};

export default AnswerRecorder;
