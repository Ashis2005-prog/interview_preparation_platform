import React from "react";
import { AlertTriangle } from "lucide-react";

const WeaknessCard = ({ weaknesses = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-5">
        <AlertTriangle className="text-orange-500" size={28} />

        <h2 className="text-2xl font-bold">Areas to Improve</h2>
      </div>

      {weaknesses.length === 0 ? (
        <p className="text-gray-500">No major weaknesses were identified.</p>
      ) : (
        <ul className="space-y-4">
          {weaknesses.map((weakness, index) => (
            <li key={index} className="flex gap-3 bg-orange-50 p-4 rounded-xl">
              <span className="text-orange-500 font-bold">!</span>

              <span className="text-gray-700">{weakness}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeaknessCard;
