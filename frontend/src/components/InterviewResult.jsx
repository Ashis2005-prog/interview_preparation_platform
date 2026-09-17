import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import ScoreCard from "../components/ScoreCard";
import FeedbackCard from "../components/FeedbackCard";
import StrengthCard from "../components/StrengthCard";
import WeaknessCard from "../components/WeaknessCard";
import ImprovementCard from "../components/ImprovementCard";

const InterviewResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const evaluation = location.state?.evaluation;

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-8">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <h1 className="text-3xl font-bold">No Interview Result Found</h1>

              <p className="text-gray-500 mt-3">
                Please complete an interview first.
              </p>

              <button
                onClick={() => navigate("/ai-interview")}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                Start Interview
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">Interview Results</h1>

                <p className="text-gray-500 mt-2">
                  Here's your AI-powered interview analysis.
                </p>
              </div>

              <button
                onClick={() => navigate("/ai-interview")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
              >
                <RotateCcw size={18} />
                New Interview
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <ScoreCard score={evaluation.overallScore} />

              <div className="lg:col-span-2">
                <FeedbackCard feedback={evaluation.feedback} />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <StrengthCard strengths={evaluation.strengths} />

              <WeaknessCard weaknesses={evaluation.weaknesses} />
            </div>

            <div className="mt-6">
              <ImprovementCard improvements={evaluation.improvements} />
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mt-8 flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewResult;
