import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SessionCard from "../components/SessionCard";

import { getSessions, deleteSession } from "../services/sessionService";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data.sessions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this interview session?");

    if (!confirmed) return;

    try {
      await deleteSession(id);
      loadSessions();
    } catch (error) {
      alert("Failed to delete session");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Interview Sessions</h1>

            <Link
              to="/create-session"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
            >
              + New Session
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h2 className="text-2xl font-bold">No Sessions Yet</h2>

              <p className="text-gray-500 mt-3">
                Create your first interview session.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sessions;
