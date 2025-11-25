import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'

// Layout Components
import Layout from './components/Layout/Layout'
import PublicLayout from './components/Layout/PublicLayout'

// Auth Pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder/ResumeBuilder'
import ResumeList from './pages/Resume/ResumeList'
import ResumeView from './pages/Resume/ResumeView'
import Profile from './pages/Profile/Profile'

// Public Pages
import Landing from './pages/Public/Landing'
import PublicResume from './pages/Public/PublicResume'
import Features from './pages/Features/Features'
import Templates from './pages/Templates/Templates'
import Pricing from './pages/Pricing/Pricing'
import Help from './pages/Help/Help'

// Error Pages
import NotFound from './pages/Error/NotFound'

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  const { user, checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/resume/:shareId" element={<PublicResume />} />
          <Route path="/features" element={<Features />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/resumes" element={
            <ProtectedRoute>
              <ResumeList />
            </ProtectedRoute>
          } />
          
          <Route path="/resumes/:id" element={
            <ProtectedRoute>
              <ResumeView />
            </ProtectedRoute>
          } />
          
          <Route path="/resumes/:id/edit" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="/resume-builder" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App