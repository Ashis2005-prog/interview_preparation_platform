import React from "react";
import { Loader2, Sparkles } from "lucide-react";

const LoadingInterview = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-5 rounded-full">
            <Loader2 className="animate-spin text-blue-600" size={60} />
          </div>
        </div>

        <h2 className="text-3xl font-bold">AI is Preparing Your Interview</h2>

        <p className="mt-4 text-gray-500">
          Gemini AI is generating personalized interview questions based on your
          company, role and selected topics.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Sparkles className="text-yellow-500 animate-pulse" />
          <Sparkles className="text-blue-500 animate-pulse" />
          <Sparkles className="text-purple-500 animate-pulse" />
        </div>

        <div className="mt-8 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className="bg-blue-600 h-3 rounded-full animate-pulse w-3/4"></div>
        </div>

        <p className="mt-3 text-sm text-gray-400">
          This usually takes 5–10 seconds...
        </p>
      </div>
    </div>
  );
};

export default LoadingInterview;
