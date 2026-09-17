import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SessionForm from "../components/SessionForm";

import { getSessionById, updateSession } from "../services/sessionService";

const EditSession = () => {
  const { id } = useParams();

  const navigate = useNavigate();

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

  const handleUpdate = async (formData) => {
    try {
      await updateSession(id, formData);

      alert("Session Updated Successfully");

      navigate("/sessions");
    } catch (err) {
      alert("Failed to update session");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Interview Session</h1>

          <SessionForm
            initialData={session}
            onSubmit={handleUpdate}
            buttonText="Update Session"
          />
        </main>
      </div>
    </div>
  );
};

export default EditSession;
