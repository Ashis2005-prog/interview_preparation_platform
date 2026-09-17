import React from "react";

const topics = [
  "Java",
  "DSA",
  "DBMS",
  "Operating System",
  "Computer Networks",
  "OOP",
  "HR Interview",
  "System Design",
];

const TopicCards = () => {
  return (
    <div className="grid md:grid-cols-4 gap-5">
      {topics.map((topic) => (
        <div
          key={topic}
          className="bg-white rounded-xl shadow p-5 hover:-translate-y-1 transition"
        >
          <h3 className="font-bold">{topic}</h3>

          <p className="text-gray-500 text-sm mt-2">
            Practice interview questions.
          </p>

          <button className="mt-4 text-blue-600 font-semibold">
            Practice →
          </button>
        </div>
      ))}
    </div>
  );
};

export default TopicCards;
