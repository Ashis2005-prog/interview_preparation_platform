import React from "react";
import { CheckCircle } from "lucide-react";

const StrengthCard = ({ strengths = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-5">
        <CheckCircle className="text-green-600" size={28} />

        <h2 className="text-2xl font-bold">Your Strengths</h2>
      </div>

      {strengths.length === 0 ? (
        <p className="text-gray-500">No strengths were identified.</p>
      ) : (
        <ul className="space-y-4">
          {strengths.map((strength, index) => (
            <li key={index} className="flex gap-3 bg-green-50 p-4 rounded-xl">
              <span className="text-green-600 font-bold">✓</span>

              <span className="text-gray-700">{strength}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StrengthCard;
