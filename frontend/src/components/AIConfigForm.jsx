import React, { useState } from "react";

const topics = [
  "DSA",
  "Java",
  "React",
  "Node.js",
  "MongoDB",
  "System Design",
  "DBMS",
  "Operating System",
  "Computer Networks",
  "HR",
];

const AIConfigForm = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    experience: 0,
    difficulty: "Medium",
    topics: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? Number(value) : value,
    }));
  };

  const toggleTopic = (topic) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.topics.length === 0) {
      return alert("Please select at least one topic.");
    }

    onGenerate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
    >
      <h2 className="text-3xl font-bold">Configure AI Interview</h2>

      <div className="grid md:grid-cols-2 gap-5">
        <input
          type="text"
          name="company"
          placeholder="Company (Google)"
          value={formData.company}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="role"
          placeholder="Role (SDE-1)"
          value={formData.role}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <input
          type="number"
          name="experience"
          value={formData.experience}
          min="0"
          max="20"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Select Topics</h3>

        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <button
              type="button"
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-4 py-2 rounded-full border ${
                formData.topics.includes(topic) ? "bg-blue-600 text-white" : ""
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
        Generate AI Questions
      </button>
    </form>
  );
};

export default AIConfigForm;
