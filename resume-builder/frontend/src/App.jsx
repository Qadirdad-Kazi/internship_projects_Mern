import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'

// Layout Components
import Layout from './components/Layout/Layout.jsx'
import PublicLayout from './components/Layout/PublicLayout.jsx'

// Auth Pages
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import ResumeBuilder from './pages/ResumeBuilder/ResumeBuilder.jsx'
import ResumeList from './pages/Resume/ResumeList.jsx'
import ResumeView from './pages/Resume/ResumeView.jsx'
import Profile from './pages/Profile/Profile.jsx'

// Public Pages
import Landing from './pages/Public/Landing.jsx'
import PublicResume from './pages/Public/PublicResume.jsx'
import Features from './pages/Features/Features.jsx'
import Templates from './pages/Templates/Templates.jsx'
import Pricing from './pages/Pricing/Pricing.jsx'
import Help from './pages/Help/Help.jsx'

// Error Pages
import NotFound from './pages/Error/NotFound.jsx'

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
          <Route index element={<Landing />} />
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
          
          <Route path="/resume-builder/new" element={
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