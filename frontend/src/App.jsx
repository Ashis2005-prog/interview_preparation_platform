import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import AIInterview from "./pages/AIInterview";
import Sessions from "./pages/Sessions";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import CreateSession from "./pages/CreateSession";
import SessionDetails from "./pages/SessionDetails";
import Questions from "./pages/Questions";
import EditSession from "./pages/EditSession";
import InterviewResult from "./pages/InterviewResult";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/ai-interview" element={<AIInterview />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-session" element={<CreateSession />} />
            <Route path="/sessions/:id" element={<SessionDetails />} />
            <Route path="/sessions/:id/questions" element={<Questions />} />
            <Route path="/sessions/:id/edit" element={<EditSession />} />
            <Route path="/interview-result" element={<InterviewResult />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
