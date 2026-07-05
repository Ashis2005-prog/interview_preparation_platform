import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Fill all fields'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center shadow-lg">
              <Code2 size={22} className="text-white" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] bg-clip-text text-transparent">PrepIQ</span>
          </div>
          <p className="text-[#8b8fa8] mt-2 text-sm">AI-Powered Interview Preparation</p>
        </div>

        <div className="bg-[#1a1d27] rounded-2xl p-8 border border-[#2e3148] shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8b8fa8] mb-1.5">Email</label>
              <div className="flex items-center gap-3 bg-[#242736] border border-[#2e3148] rounded-lg px-3 py-2.5 focus-within:border-[#6c63ff] transition-colors">
                <Mail size={16} className="text-[#8b8fa8]" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com" className="flex-1 bg-transparent outline-none text-[#e8eaf6] text-sm placeholder-[#4a4f6a]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8b8fa8] mb-1.5">Password</label>
              <div className="flex items-center gap-3 bg-[#242736] border border-[#2e3148] rounded-lg px-3 py-2.5 focus-within:border-[#6c63ff] transition-colors">
                <Lock size={16} className="text-[#8b8fa8]" />
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••" className="flex-1 bg-transparent outline-none text-[#e8eaf6] text-sm placeholder-[#4a4f6a]" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-sm text-[#8b8fa8] mt-4">
            No account? <Link to="/register" className="text-[#6c63ff] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
