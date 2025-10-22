import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()
  
  return (
    <section className="section">
      <div className="container">
        <div className="contact-card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <h2>404 — Page Not Found</h2>
          <p>The page <code style={{ color: 'var(--kopiko)' }}>{location.pathname}</code> doesn't exist.</p>
          <div style={{ marginTop: 24 }}>
            <Link to="/" className="btn btn-accent">← Back to Home</Link>
          </div>
          
          <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>Navigation Demo:</strong> This 404 page appears for any unmatched route.
              Try visiting: <code style={{ color: 'var(--cream-50)' }}>/anypath</code>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
