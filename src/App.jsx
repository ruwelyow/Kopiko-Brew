import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import MenuItem from './pages/MenuItem'
import Cart from './pages/Cart'
import Story from './pages/Story'
import Locations from './pages/Locations'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import ProtectedRoute from './auth/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/:id" element={<MenuItem />} />
            <Route path="cart" element={<Cart />} />
            <Route path="story" element={<Story />} />
            <Route path="locations" element={<Locations />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected Route with Nested Routes */}
            <Route path="account" element={<ProtectedRoute />}>
              <Route index element={<Account />} />
              <Route path="orders" element={<Account view="orders" />} />
              <Route path="settings" element={<Account view="settings" />} />
              <Route path="profile" element={<Account view="profile" />} />
            </Route>

            {/* 404 Handling */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
