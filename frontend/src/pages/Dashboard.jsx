import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Code2,
  BrainCircuit,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH RESULTS
  // ==========================================

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/results");

        if (response.data.success) {
          setResults(response.data.results || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard results:", err);
        setError("Failed to load your activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // ==========================================
  // COMPUTE STATS FROM RESULTS
  // ==========================================

  const practiceCount = results.filter(
    (r) => r.interviewType === "Practice",
  ).length;

  const interviewCount = results.filter(
    (r) => r.interviewType === "AI Interview",
  ).length;

  const questionsSolved = results.reduce(
    (sum, r) => sum + (r.questionEvaluations?.length || r.answers?.length || 0),
    0,
  );

  const avgScore =
    results.length > 0
      ? Math.round(
          (results.reduce((sum, r) => sum + (r.overallScore || 0), 0) /
            results.length) *
            10,
        )
      : 0;

  const stats = [
    {
      id: "sessions",
      title: "Practice Sessions",
      value: practiceCount,
      icon: BookOpen,
    },
    {
      id: "questions",
      title: "Questions Solved",
      value: questionsSolved,
      icon: Code2,
    },
    {
      id: "interviews",
      title: "AI Interviews",
      value: interviewCount,
      icon: BrainCircuit,
    },
    {
      id: "progress",
      title: "Progress",
      value: `${avgScore}%`,
      icon: TrendingUp,
    },
  ];

  const quickActions = [
    {
      id: "practice",
      title: "Start Practice",
      description: "Practice technical interview questions.",
      path: "/practice",
      icon: Code2,
    },
    {
      id: "ai-interview",
      title: "AI Interview",
      description: "Take an AI-powered mock interview.",
      path: "/ai-interview",
      icon: BrainCircuit,
    },
    {
      id: "sessions",
      title: "My Sessions",
      description: "View and manage your interview sessions.",
      path: "/sessions",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-6 md:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {user?.name || "Developer"} 👋
            </h1>

            <p className="mt-2 text-slate-600">
              Continue your interview preparation journey.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.title}</p>

                      <h2 className="text-3xl font-bold text-slate-900 mt-2">
                        {loading ? "—" : stat.value}
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Quick Actions
                </h2>

                <p className="text-slate-500 mt-1">
                  Start preparing for your next interview.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.id}
                    to={action.path}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                      <Icon size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {action.title}
                    </h3>

                    <p className="text-slate-500 mt-2">{action.description}</p>

                    <div className="flex items-center gap-2 mt-5 text-blue-600 font-medium">
                      Get Started
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="mt-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Recent Activity
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Your latest practice sessions and interviews.
                  </p>
                </div>

                <Link
                  to="/sessions"
                  className="text-blue-600 font-medium hover:underline"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10 text-slate-400">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Loading activity...
                </div>
              ) : error ? (
                <p className="text-red-600 text-sm py-4">{error}</p>
              ) : results.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">
                  No practice sessions or interviews yet. Start one above!
                </p>
              ) : (
                <div className="space-y-3">
                  {results.slice(0, 5).map((result) => (
                    <div
                      key={result._id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {result.interviewType}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-lg font-bold text-blue-600">
                        {result.overallScore}/10
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
