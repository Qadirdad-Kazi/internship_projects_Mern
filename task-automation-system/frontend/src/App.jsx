import React, { useState } from 'react'
import './styles.css'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <Layout>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <Dashboard />
      )}
    </Layout>
  )
}
