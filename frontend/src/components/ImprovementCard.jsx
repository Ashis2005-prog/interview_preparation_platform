import React from "react";
import { Lightbulb } from "lucide-react";

const ImprovementCard = ({ improvements = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-5">
        <Lightbulb className="text-yellow-500" size={28} />

        <h2 className="text-2xl font-bold">Improvement Suggestions</h2>
      </div>

      {improvements.length === 0 ? (
        <p className="text-gray-500">No improvement suggestions available.</p>
      ) : (
        <ul className="space-y-4">
          {improvements.map((improvement, index) => (
            <li
              key={index}
              className="bg-yellow-50 p-4 rounded-xl text-gray-700"
            >
              <span className="font-bold mr-2">{index + 1}.</span>

              {improvement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImprovementCard;
