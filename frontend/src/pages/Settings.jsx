import React, { useEffect, useState } from "react";
import {
  Bell,
  Moon,
  Lock,
  LogOut,
  Save,
  Shield,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  const [notifications, setNotifications] = useState(
    user?.notifications ?? true,
  );

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingPreferences, setSavingPreferences] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setNotifications(user.notifications ?? true);
    }
  }, [user]);

  const savePreferences = async () => {
    try {
      setSavingPreferences(true);
      setMessage("");
      setError("");

      const response = await api.put("/auth/profile", {
        notifications,
        darkMode,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save preferences");
      }

      updateUser(response.data.user);

      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Settings error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save settings.",
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to change password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");
    } catch (error) {
      console.error("Password change error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Manage your account preferences and security.
              </p>
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 size={18} />
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Account */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <User size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Account
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your account information.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white mt-1">
                    {user.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white mt-1 break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                  <Bell size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Preferences
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customize your experience.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Notifications */}
                <div className="flex items-center justify-between gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800">
                  <div className="flex items-start gap-3">
                    <Bell
                      size={20}
                      className="text-gray-500 dark:text-gray-400 mt-1"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Receive notifications about your interview progress.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setNotifications((prev) => !prev)}
                    className={`relative w-12 h-6 rounded-full transition ${
                      notifications
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
                        notifications ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800">
                  <div className="flex items-start gap-3">
                    <Moon
                      size={20}
                      className="text-gray-500 dark:text-gray-400 mt-1"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Dark Mode
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Save your preferred appearance setting.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDarkMode((prev) => !prev)}
                    className={`relative w-12 h-6 rounded-full transition ${
                      darkMode ? "bg-blue-600" : "bg-gray-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
                        darkMode ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={savePreferences}
                disabled={savingPreferences}
                className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={18} />

                {savingPreferences ? "Saving..." : "Save Preferences"}
              </button>
            </section>

            {/* Security */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                  <Shield size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Security
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Protect your account.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </section>

            {/* Logout */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900 shadow-sm p-6 md:p-8 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Sign Out
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Sign out of your account on this device.
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
