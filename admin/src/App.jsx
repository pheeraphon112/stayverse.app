import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import PropertyForm from './pages/PropertyForm'
import Leads from './pages/Leads'
import Applications from './pages/Applications'
import Users from './pages/Users'
import Settings from './pages/Settings'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading StayVerse Admin...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout session={session} />}>
        <Route index element={<Dashboard />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/new" element={<PropertyForm />} />
        <Route path="properties/:id" element={<PropertyForm />} />
        <Route path="leads" element={<Leads />} />
        <Route path="applications" element={<Applications />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
