import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SessionForm from "../components/SessionForm";

import { createSession } from "../services/sessionService";

const CreateSession = () => {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await createSession(data);

      alert("Session Created Successfully");

      navigate("/sessions");
    } catch (error) {
      console.error(error);

      alert("Failed to create session");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Create Interview Session</h1>

          <SessionForm onSubmit={handleCreate} buttonText="Create Session" />
        </main>
      </div>
    </div>
  );
};

export default CreateSession;
