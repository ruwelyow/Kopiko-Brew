import React from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Account({ view = 'dashboard' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Demo of programmatic navigation on logout
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <section className="section">
      <div className="container">
        <div className="contact-card" style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0 }}>Your Account</h2>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </div>

          {/* Nested Route Navigation */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <Link 
              to="/account" 
              className={`btn ${view === 'dashboard' ? 'btn-accent' : 'btn-ghost'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/account/orders" 
              className={`btn ${view === 'orders' ? 'btn-accent' : 'btn-ghost'}`}
            >
              Orders
            </Link>
            <Link 
              to="/account/settings" 
              className={`btn ${view === 'settings' ? 'btn-accent' : 'btn-ghost'}`}
            >
              Settings
            </Link>
            <Link 
              to="/account/profile" 
              className={`btn ${view === 'profile' ? 'btn-accent' : 'btn-ghost'}`}
            >
              Profile
            </Link>
          </div>

          {/* Content based on nested route */}
          {view === 'dashboard' && (
            <div>
              <h3>Welcome back, {user?.name}!</h3>
              <p>This is your account dashboard. Select a section above to manage your account.</p>
            </div>
          )}

          {view === 'orders' && (
            <div>
              <h3>Your Orders</h3>
              <p>Your order history will appear here.</p>
            </div>
          )}

          {view === 'settings' && (
            <div>
              <h3>Account Settings</h3>
              <p>Manage your account preferences here.</p>
            </div>
          )}

          {view === 'profile' && (
            <div>
              <h3>Profile</h3>
              <p>Update your profile information here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
