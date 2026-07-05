import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  LayoutDashboard, Code2, Map, Bot, BarChart3,
  Sun, Moon, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/questions', icon: Code2,           label: 'Problems'  },
  { to: '/roadmap',   icon: Map,             label: 'Roadmap'   },
  { to: '/ai',        icon: Bot,             label: 'AI Coach'  },
  { to: '/progress',  icon: BarChart3,       label: 'Progress'  },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0f1117] text-[#e8eaf6]' : 'bg-[#f8f9fe] text-[#1a1c2e]'} font-sans`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${dark ? 'bg-[#1a1d27]/90 border-[#2e3148]' : 'bg-white/90 border-[#dde1f0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center shadow-lg">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] bg-clip-text text-transparent">PrepIQ</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#ede9ff] dark:bg-[#312e6b] text-[#6c63ff]'
                    : dark ? 'text-[#8b8fa8] hover:text-[#e8eaf6] hover:bg-[#242736]' : 'text-[#6b6f8a] hover:text-[#1a1c2e] hover:bg-[#f0f2f9]'
                }`
              }>
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggleTheme} className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${dark ? 'border-[#2e3148] bg-[#242736] text-[#e8eaf6] hover:bg-[#2e3148]' : 'border-[#dde1f0] bg-[#f0f2f9] text-[#1a1c2e] hover:bg-[#e0e4f4]'}`}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border ${dark ? 'border-[#2e3148] bg-[#242736]' : 'border-[#dde1f0] bg-[#f0f2f9]'}`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-semibold">{user?.username}</span>
            </div>
            <button onClick={handleLogout} title="Logout" className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${dark ? 'border-[#2e3148] bg-[#242736] text-[#8b8fa8] hover:text-[#ef4444]' : 'border-[#dde1f0] bg-[#f0f2f9] text-[#6b6f8a] hover:text-[#ef4444]'}`}>
              <LogOut size={16} />
            </button>
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(v => !v)} className={`md:hidden w-9 h-9 rounded-lg border flex items-center justify-center ${dark ? 'border-[#2e3148] bg-[#242736]' : 'border-[#dde1f0] bg-[#f0f2f9]'}`}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className={`md:hidden border-t px-4 py-3 flex flex-col gap-1 ${dark ? 'border-[#2e3148] bg-[#1a1d27]' : 'border-[#dde1f0] bg-white'}`}>
            {NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-[#ede9ff] text-[#6c63ff]' : dark ? 'text-[#8b8fa8]' : 'text-[#6b6f8a]'}`
                }>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-up">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`text-center py-4 text-xs border-t ${dark ? 'border-[#2e3148] text-[#8b8fa8]' : 'border-[#dde1f0] text-[#6b6f8a]'}`}>
        PrepIQ © 2026 · MERN Stack · Trie · Graph · Heap · JWT · AI
      </footer>
    </div>
  )
}
