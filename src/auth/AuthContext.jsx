import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const navigate = useNavigate()

  // Load user on startup if token exists
  useEffect(() => {
    if (!token) return
    // No user endpoint; token contains user id in this demo. We'll set a minimal user.
    // In a real app you would call /me or decode token to fetch user details.
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [token])

  async function login(email, password) {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, message: data.message || 'Login failed' }
      setToken(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      navigate('/')
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }

  async function register(firstName, lastName, email, password) {
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, message: data.message || 'Register failed' }
      
      // Don't automatically log in - just redirect to login page
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in to continue.',
          email: email // Pre-fill the email field
        } 
      })
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
