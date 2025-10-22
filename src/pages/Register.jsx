import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link } from 'react-router-dom'

export default function Register() {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()

  const submit = (e) => {
    e.preventDefault()
    ;(async () => {
      const res = await register(first, last, email, password)
      // Note: AuthContext navigates on success. If failure, you could display an error.
      if (!res.ok) {
        // For now, simple alert; could show inline error state
        alert(res.message || 'Registration failed')
      }
    })()
  }

  return (
    <section className="section">
      <div className="container">
        <div className="contact-card" style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2>Create an account</h2>
          <p>Join Kopiko Brew for order tracking and exclusive offers.</p>
          
          <form onSubmit={submit} className="form-flex">
            <div className="form-row">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="First name" 
                  value={first} 
                  onChange={e => setFirst(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Last name" 
                  value={last} 
                  onChange={e => setLast(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
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
              Create account
            </button>
          </form>
          
          <p style={{ marginTop: 24 }}>
            Already have an account? {' '}
            <Link to="/login" style={{ color: 'var(--cream-50)' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
