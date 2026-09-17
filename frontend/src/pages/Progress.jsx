import React, { useEffect, useState } from "react";

import { Trophy, Target, TrendingUp, BarChart3, RefreshCw } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import ProgressStatCard from "../components/ProgressStatCard";
import InterviewHistoryCard from "../components/InterviewHistoryCard";

import { getInterviewResults } from "../services/resultService";

const Progress = () => {
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInterviewResults();

      if (response.success) {
        setResults(response.results || []);
      } else {
        throw new Error(response.message || "Failed to load results");
      }
    } catch (error) {
      console.error("Progress error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your interview progress.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const totalInterviews = results.length;

  const averageScore =
    totalInterviews > 0
      ? results.reduce(
          (sum, result) => sum + Number(result.overallScore || 0),
          0,
        ) / totalInterviews
      : 0;

  const bestScore =
    totalInterviews > 0
      ? Math.max(...results.map((result) => Number(result.overallScore || 0)))
      : 0;

  const latestScore =
    totalInterviews > 0 ? Number(results[0].overallScore || 0) : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Your Progress
                </h1>

                <p className="text-gray-500 mt-2">
                  Track your interview performance and improve consistently.
                </p>
              </div>

              <button
                onClick={loadResults}
                className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-gray-50"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Statistics */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ProgressStatCard
                    title="Total Interviews"
                    value={totalInterviews}
                    subtitle="Completed interviews"
                    icon={BarChart3}
                  />

                  <ProgressStatCard
                    title="Average Score"
                    value={`${averageScore.toFixed(1)}/10`}
                    subtitle="Overall performance"
                    icon={TrendingUp}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                  />

                  <ProgressStatCard
                    title="Best Score"
                    value={`${bestScore.toFixed(1)}/10`}
                    subtitle="Your highest score"
                    icon={Trophy}
                    iconBg="bg-yellow-100"
                    iconColor="text-yellow-600"
                  />

                  <ProgressStatCard
                    title="Latest Score"
                    value={`${latestScore.toFixed(1)}/10`}
                    subtitle="Most recent interview"
                    icon={Target}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                  />
                </div>

                {/* No interviews */}
                {results.length === 0 ? (
                  <div className="bg-white rounded-3xl shadow-md p-12 text-center mt-8">
                    <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Trophy size={30} />
                    </div>

                    <h2 className="text-2xl font-bold mt-5">
                      No interviews yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Complete your first AI mock interview to start tracking
                      your progress.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Score Overview */}
                    <div className="bg-white rounded-3xl shadow-md p-8 mt-8">
                      <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-blue-600" size={26} />

                        <h2 className="text-2xl font-bold">
                          Performance Overview
                        </h2>
                      </div>

                      <div className="flex items-end gap-3 h-48">
                        {results
                          .slice()
                          .reverse()
                          .map((result, index) => {
                            const score = Number(result.overallScore || 0);

                            const height = `${Math.max(score * 10, 5)}%`;

                            return (
                              <div
                                key={result._id || index}
                                className="flex-1 h-full flex flex-col justify-end items-center"
                              >
                                <span className="text-sm font-semibold mb-2">
                                  {score.toFixed(1)}
                                </span>

                                <div
                                  className="w-full max-w-12 bg-blue-600 rounded-t-lg hover:bg-blue-700 transition"
                                  style={{
                                    height,
                                  }}
                                  title={`Interview ${index + 1}: ${score}/10`}
                                />

                                <span className="text-xs text-gray-400 mt-2">
                                  #{index + 1}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* History */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-2xl font-bold">
                            Interview History
                          </h2>

                          <p className="text-gray-500 mt-1">
                            Review your previous AI interviews.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {results.map((result) => (
                          <InterviewHistoryCard
                            key={result._id}
                            result={result}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Progress;
