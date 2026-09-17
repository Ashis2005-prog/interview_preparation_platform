import React, { useEffect, useState } from "react";
import { Bell, Search, Moon, Sun, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const { toggleSidebar } = useSidebar();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/practice?search=${encodeURIComponent(query)}`);
  };

  const clearSearch = () => setSearch("");

  const handleKeyDown = (e) => {
    if (e.key === "Escape") clearSearch();
  };

  const toggleNotifications = async () => {
    const next = !showNotifications;
    setShowNotifications(next);

    if (next && notifItems.length === 0) {
      try {
        setLoadingNotifs(true);
        const response = await api.get("/results");
        if (response.data.success) {
          setNotifItems((response.data.results || []).slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoadingNotifs(false);
      }
    }
  };

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header
      className="
        h-20
        bg-white dark:bg-slate-900
        border-b border-gray-200 dark:border-slate-700
        flex items-center justify-between
        px-4 sm:px-6
        sticky top-0
        z-40
        transition-colors
      "
    >
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 mr-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
        aria-label="Toggle menu"
      >
        <Menu size={24} className="text-gray-700 dark:text-gray-200" />
      </button>
      {/* ================= LEFT - LOGO ================= */}
      <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
          P
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            PrepIQ
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Practice smarter, interview better
          </p>
        </div>
      </Link>

      {/* ================= SEARCH ================= */}
      <form
        onSubmit={handleSearch}
        className="
          hidden md:flex
          items-center
          bg-gray-100 dark:bg-slate-800
          rounded-lg
          px-3 py-2
          w-72 lg:w-96
          border border-transparent
          focus-within:border-blue-500
          focus-within:ring-2
          focus-within:ring-blue-500/20
          transition
        "
      >
        <Search
          size={18}
          className="text-gray-500 dark:text-gray-400 shrink-0"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search questions..."
          aria-label="Search questions"
          className="
            bg-transparent
            outline-none
            ml-2
            w-full
            text-sm
            text-gray-800 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
            aria-label="Clear search"
          >
            <X size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </form>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Notifications"
          >
            <Bell size={22} className="text-gray-700 dark:text-gray-200" />
            {user?.notifications !== false && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </button>

          {showNotifications && (
              <div className="fixed left-4 right-4 top-20 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 w-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 font-semibold text-gray-800 dark:text-white">
                Recent Activity
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loadingNotifs ? (
                  <p className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </p>
                ) : notifItems.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    No recent activity yet.
                  </p>
                ) : (
                  notifItems.map((item) => (
                    <div
                      key={item._id}
                      className="px-4 py-3 border-b border-gray-50 dark:border-slate-700 last:border-0"
                    >
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {item.interviewType} completed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Score: {item.overallScore}/10 •{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode */}
        <button
          type="button"
          onClick={() => setDarkMode((previous) => !previous)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun size={22} className="text-yellow-400" />
          ) : (
            <Moon size={22} className="text-gray-700 dark:text-gray-200" />
          )}
        </button>

        {/* Profile */}
        <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || "Student"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
