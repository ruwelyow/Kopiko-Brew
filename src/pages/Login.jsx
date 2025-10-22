import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useLocation, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const { login } = useAuth()
  const location = useLocation()

  const from = location.state?.from?.pathname || location.state?.from || '/'

  // Handle registration success message and pre-fill email
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message)
    }
    if (location.state?.email) {
      setEmail(location.state.email)
    }
  }, [location.state])

  const submit = (e) => {
    e.preventDefault()
    ;(async () => {
      const res = await login(email, password)
      if (!res.ok) setErr(res.message || 'Login failed')
    })()
  }

  return (
    <section className="section">
      <div className="container">
        <div className="contact-card" style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2>Welcome back</h2>
          <p>Sign in to access your orders and special offers.</p>
          
          {successMsg && (
            <div style={{ 
              background: 'rgba(74, 222, 128, 0.1)', 
              border: '1px solid rgba(74, 222, 128, 0.3)', 
              borderRadius: '12px', 
              padding: '12px', 
              marginBottom: '20px',
              color: '#4ade80',
              textAlign: 'center'
            }}>
              {successMsg}
            </div>
          )}
          
          <form onSubmit={submit} className="form-flex">
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button className="btn btn-accent full" type="submit">
              Login
            </button>
            
            {err && <p className="error">{err}</p>}
          </form>
          
          <p style={{ marginTop: 24 }}>
            Don't have an account? {' '}
            <Link to="/register" style={{ color: 'var(--cream-50)' }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
