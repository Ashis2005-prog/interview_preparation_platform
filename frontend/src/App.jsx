import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/common/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import QuestionsPage from './pages/QuestionsPage'
import RoadmapPage from './pages/RoadmapPage'
import AICoachPage from './pages/AICoachPage'
import ProgressPage from './pages/ProgressPage'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/" element={<PrivateRoute><ThemeProvider><Layout /></ThemeProvider></PrivateRoute>}>
        <Route index         element={<DashboardPage />} />
        <Route path="questions" element={<QuestionsPage />} />
        <Route path="roadmap"   element={<RoadmapPage />} />
        <Route path="ai"        element={<AICoachPage />} />
        <Route path="progress"  element={<ProgressPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
