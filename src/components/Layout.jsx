import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../context/CartContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()

  return (
    <div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="logo">
            <span className="logo-mark">K</span>
            <span className="logo-text">Kopiko Brew</span>
          </Link>
          <input id="nav-toggle" className="nav-toggle" type="checkbox" />
          <label htmlFor="nav-toggle" className="hamburger" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </label>
          <nav className="nav">
            <Link to="/menu">Menu</Link>
            <Link to="/story">Our Story</Link>
            <Link to="/locations">Locations</Link>
            <Link to="/contact">Contact</Link>
            {user ? (
              <>
                <span>Welcome, {user.name}!</span>
                <button className="btn btn-accent" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" id="open-login">Login</Link>
                <Link to="/register" id="open-register">Register</Link>
              </>
            )}
            <Link to="/cart" className="btn btn-accent cart-btn">
              🛒 Cart ({getTotalItems()})
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container foot-grid">
          <div className="brand">
            <div className="logo mini">
              <span className="logo-mark">K</span>
              <span className="logo-text">Kopiko Brew</span>
            </div>
            <p className="muted">© <span id="year"></span> Kopiko Brew. All rights reserved.</p>
          </div>
          <nav className="foot-nav">
            <Link to="/menu">Menu</Link>
            <Link to="/story">Story</Link>
            <Link to="/locations">Locations</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div className="socials">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
