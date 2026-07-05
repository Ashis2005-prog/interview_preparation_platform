import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token     = localStorage.getItem('prepiq_token')
    const savedUser = localStorage.getItem('prepiq_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      authAPI.me().then(res => {
        setUser(res.data.user)
        localStorage.setItem('prepiq_user', JSON.stringify(res.data.user))
      }).catch(() => logout())
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token, user: u } = res.data
    localStorage.setItem('prepiq_token', token)
    localStorage.setItem('prepiq_user',  JSON.stringify(u))
    setUser(u)
    return u
  }

  const register = async (username, email, password) => {
    const res = await authAPI.register({ username, email, password })
    const { token, user: u } = res.data
    localStorage.setItem('prepiq_token', token)
    localStorage.setItem('prepiq_user',  JSON.stringify(u))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('prepiq_token')
    localStorage.removeItem('prepiq_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updatePreferences = async (prefs) => {
    const res = await authAPI.preferences(prefs)
    const updated = { ...user, preferences: res.data.preferences }
    setUser(updated)
    localStorage.setItem('prepiq_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
