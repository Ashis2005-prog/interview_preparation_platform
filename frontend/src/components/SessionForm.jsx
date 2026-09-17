import React, { useEffect, useState } from "react";

const topicsList = [
  "Java",
  "DSA",
  "DBMS",
  "Operating System",
  "Computer Networks",
  "OOP",
  "System Design",
  "HR",
];

const SessionForm = ({
  onSubmit,
  initialData = null,
  buttonText = "Create Session",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    role: "",
    experience: 0,
    difficulty: "Medium",
    topics: [],
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        company: initialData.company || "",
        role: initialData.role || "",
        experience: initialData.experience || 0,
        difficulty: initialData.difficulty || "Medium",
        topics: initialData.topics || [],
        description: initialData.description || "",
      });
    }
  }, [initialData]);

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
      alert("Please select at least one topic.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 space-y-6"
    >
      {/* Title */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Session Title
        </label>

        <input
          type="text"
          name="title"
          placeholder="e.g. Amazon SDE-1 Interview"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Company & Role */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Company
          </label>

          <input
            type="text"
            name="company"
            placeholder="Google"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Role</label>

          <input
            type="text"
            name="role"
            placeholder="Software Engineer"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Experience & Difficulty */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Experience (Years)
          </label>

          <input
            type="number"
            min="0"
            max="30"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Difficulty
          </label>

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Topics */}
      <div>
        <label className="block mb-3 font-semibold text-gray-700">
          Select Topics
        </label>

        <div className="flex flex-wrap gap-3">
          {topicsList.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                formData.topics.includes(topic)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Description
        </label>

        <textarea
          rows="5"
          name="description"
          placeholder="Write something about this interview session..."
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default SessionForm;
