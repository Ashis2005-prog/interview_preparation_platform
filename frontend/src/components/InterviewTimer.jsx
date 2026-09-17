import React, { useEffect, useState } from "react";

const InterviewTimer = ({ duration = 300, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg">Time Remaining</h2>

      <span className="text-2xl font-bold text-red-600">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

export default InterviewTimer;
