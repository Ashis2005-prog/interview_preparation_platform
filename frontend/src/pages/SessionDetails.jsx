import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getSessionById } from "../services/sessionService";

const SessionDetails = () => {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await getSessionById(id);
        setSession(data.session);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Session Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">{session.title}</h1>

                <p className="text-gray-500 mt-2">
                  {session.company} • {session.role}
                </p>
              </div>

              <span className="bg-blue-600 text-white px-4 py-2 rounded-full">
                {session.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="font-semibold">Difficulty</h3>

                <p>{session.difficulty}</p>
              </div>

              <div>
                <h3 className="font-semibold">Experience</h3>

                <p>{session.experience} Years</p>
              </div>

              <div>
                <h3 className="font-semibold">Score</h3>

                <p>{session.score}%</p>
              </div>

              <div>
                <h3 className="font-semibold">Created</h3>

                <p>{new Date(session.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Topics</h3>

              <div className="flex flex-wrap gap-3">
                {session.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Description</h3>

              <p className="text-gray-600">
                {session.description || "No description added."}
              </p>
            </div>

            <div className="mt-10 flex gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
                Start Interview
              </button>

              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl">
                Edit Session
              </button>

              <Link
                to="/sessions"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl"
              >
                Back
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SessionDetails;
