import React from "react";
import { MessageSquare } from "lucide-react";

const FeedbackCard = ({ feedback }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-blue-100 p-3 rounded-xl">
          <MessageSquare className="text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold">AI Interviewer Feedback</h2>
      </div>

      <p className="text-gray-600 leading-8">
        {feedback || "No feedback available."}
      </p>
    </div>
  );
};

export default FeedbackCard;
