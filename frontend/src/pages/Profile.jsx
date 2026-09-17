import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Calendar,
  Edit3,
  Save,
  X,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const TOPICS = [
  "DSA",
  "Java",
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "MongoDB",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "System Design",
];

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: 0,
    preferredTopics: [],
  });

  // Keep form synchronized with the logged-in user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        experience: user.experience || 0,
        preferredTopics: user.preferredTopics || [],
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const initials = user.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTopic = (topic) => {
    setFormData((prev) => ({
      ...prev,
      preferredTopics: prev.preferredTopics.includes(topic)
        ? prev.preferredTopics.filter((item) => item !== topic)
        : [...prev.preferredTopics, topic],
    }));
  };

  const startEditing = () => {
    setMessage("");
    setError("");

    setFormData({
      name: user.name || "",
      email: user.email || "",
      experience: user.experience || 0,
      preferredTopics: user.preferredTopics || [],
    });

    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setError("");
    setMessage("");

    setFormData({
      name: user.name || "",
      email: user.email || "",
      experience: user.experience || 0,
      preferredTopics: user.preferredTopics || [],
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put("/auth/profile", {
        name: formData.name,
        email: formData.email,
        experience: Number(formData.experience),
        preferredTopics: formData.preferredTopics,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to update profile");
      }

      updateUser(response.data.user);

      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex min-w-0">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-5xl mx-auto">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
              <div className="min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 break-words">
                  My Profile
                </h1>

                <p className="text-gray-500 mt-2">
                  View and manage your personal information.
                </p>
              </div>

              {!editing ? (
                <button
                  onClick={startEditing}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X size={18} />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* ================= MESSAGES ================= */}

            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            {/* ================= PROFILE CARD ================= */}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Banner */}
              <div className="h-24 sm:h-28 bg-gradient-to-r from-blue-600 to-indigo-600" />

              {/* Profile Identity */}
              <div className="px-5 sm:px-6 md:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Avatar */}
                  <div className="w-24 h-24 shrink-0 rounded-2xl bg-white p-1 shadow-lg -mt-8">
                    <div className="w-full h-full rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                      {initials}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="min-w-0 flex-1 pt-2 sm:pt-0 pb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight break-words">
                      {user.name}
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500 mt-1 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= INFORMATION ================= */}

              <div className="p-5 sm:p-6 md:p-8 pt-10 sm:pt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />

                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full min-w-0 pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />

                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full min-w-0 pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience
                    </label>

                    <div className="relative">
                      <Briefcase
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />

                      <input
                        name="experience"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.experience}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full min-w-0 pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      Experience in years
                    </p>
                  </div>

                  {/* Joined */}
                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Member Since
                    </label>

                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 min-w-0">
                      <Calendar size={18} className="text-gray-400 shrink-0" />

                      <span className="text-gray-600 truncate">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================= TOPICS ================= */}

                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={20} className="text-blue-600 shrink-0" />

                    <h3 className="font-bold text-gray-900">
                      Preferred Topics
                    </h3>
                  </div>

                  {editing ? (
                    <div className="flex flex-wrap gap-3">
                      {TOPICS.map((topic) => {
                        const selected =
                          formData.preferredTopics.includes(topic);

                        return (
                          <button
                            type="button"
                            key={topic}
                            onClick={() => toggleTopic(topic)}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition ${
                              selected
                                ? "border-blue-600 bg-blue-50 text-blue-600"
                                : "border-gray-200 text-gray-600 hover:border-blue-300"
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.preferredTopics?.length > 0 ? (
                        user.preferredTopics.map((topic) => (
                          <span
                            key={topic}
                            className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-400">
                          No preferred topics selected.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= ACCOUNT SUMMARY ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 min-w-0">
                <p className="text-sm text-gray-500">Account Type</p>

                <p className="text-xl font-bold text-gray-900 mt-1 capitalize break-words">
                  {user.role || "User"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 min-w-0">
                <p className="text-sm text-gray-500">Experience</p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {user.experience || 0} Years
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 min-w-0">
                <p className="text-sm text-gray-500">Preferred Topics</p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {user.preferredTopics?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
