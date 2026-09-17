import React from "react";

const sessions = [
  {
    name: "Java Interview",
    score: "90%",
    date: "Today",
  },
  {
    name: "DBMS",
    score: "82%",
    date: "Yesterday",
  },
  {
    name: "DSA",
    score: "76%",
    date: "2 days ago",
  },
];

const RecentSessions = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Recent Sessions</h2>

      {sessions.map((item, index) => (
        <div key={index} className="flex justify-between border-b py-4">
          <div>
            <h3 className="font-semibold">{item.name}</h3>

            <p className="text-gray-500 text-sm">{item.date}</p>
          </div>

          <span className="font-bold text-green-600">{item.score}</span>
        </div>
      ))}
    </div>
  );
};

export default RecentSessions;
