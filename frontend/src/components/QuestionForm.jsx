import React, { useState } from "react";

const QuestionForm = ({ sessionId, onSubmit }) => {
  const [formData, setFormData] = useState({
    session: sessionId,
    question: "",
    answer: "",
    topic: "",
    difficulty: "Medium",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    setFormData({
      session: sessionId,
      question: "",
      answer: "",
      topic: "",
      difficulty: "Medium",
      notes: "",
    });
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
    >
      <input
        name="question"
        placeholder="Interview Question"
        value={formData.question}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
        required
      />

      <textarea
        name="answer"
        placeholder="Expected Answer"
        rows={4}
        value={formData.answer}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="topic"
          placeholder="Topic"
          value={formData.topic}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <textarea
        name="notes"
        placeholder="Notes"
        rows={3}
        value={formData.notes}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
      >
        Add Question
      </button>
    </form>
  );
};

export default QuestionForm;
