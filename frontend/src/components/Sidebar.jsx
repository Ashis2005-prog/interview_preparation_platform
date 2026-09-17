import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  BrainCircuit,
  BookOpen,
  TrendingUp,
  Settings,
  User,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "practice",
    name: "Practice",
    path: "/practice",
    icon: Code2,
  },
  {
    id: "ai-interview",
    name: "AI Interview",
    path: "/ai-interview",
    icon: BrainCircuit,
  },
  {
    id: "sessions",
    name: "Sessions",
    path: "/sessions",
    icon: BookOpen,
  },
  {
    id: "progress",
    name: "Progress",
    path: "/progress",
    icon: TrendingUp,
  },
  {
    id: "profile",
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">PrepIQ</h1>
        <p className="text-sm text-slate-400 mt-1">Interview Preparation</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />

                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">© 2026 PrepAI</p>
      </div>
    </aside>
  );
};

export default Sidebar;
