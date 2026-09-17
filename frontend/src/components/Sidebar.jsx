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
  X,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

const menuItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  { id: "practice", name: "Practice", path: "/practice", icon: Code2 },
  {
    id: "ai-interview",
    name: "AI Interview",
    path: "/ai-interview",
    icon: BrainCircuit,
  },
  { id: "sessions", name: "Sessions", path: "/sessions", icon: BookOpen },
  { id: "progress", name: "Progress", path: "/progress", icon: TrendingUp },
  { id: "profile", name: "Profile", path: "/profile", icon: User },
  { id: "settings", name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-screen md:min-h-screen
          w-64 bg-slate-900 text-white flex flex-col
          z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">PrepIQ</h1>
            <p className="text-sm text-slate-400 mt-1">Interview Preparation</p>
          </div>

          <button
            onClick={closeSidebar}
            className="md:hidden p-1 rounded hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={closeSidebar}
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
    </>
  );
};

export default Sidebar;
