import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import menuData from '../data/menu'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../context/CartContext'

export default function MenuItem() {
  const { id } = useParams()
  const item = menuData.find(m => String(m.id) === id)
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const { addItem, updateQuantity, items } = useCart()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  if (!item) return <div className="container"><h2>Item not found</h2></div>

  const cartItem = items.find(cartItem => cartItem.id === item.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const handleAddToCart = () => {
    addItem(item)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      // Remove from cart
      updateQuantity(item.id, 0)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }

  const handleOrderNow = async () => {
    if (!user) {
      navigate('/login', {
        state: { from: `/menu/${id}`, itemName: item.title }
      })
      return
    }
    
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ itemId: item.id, quantity: quantity || 1 })
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg(data.message || 'Order failed')
      } else {
        console.log('✅ MenuItem order successful, showing popup')
        // Clear this item from cart after successful order
        updateQuantity(item.id, 0)
        setShowSuccessPopup(true)
        // Redirect to home after 2 seconds
        setTimeout(() => {
          setShowSuccessPopup(false)
          navigate('/')
        }, 2000)
      }
    } catch (err) {
      setMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="contact-card" style={{ maxWidth: 720, margin: '24px auto' }}>
        <div className="item-detail">
          <img src={item.image} alt={item.title} />
          <div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="price">{item.price}</div>
            
            {/* Cart Controls */}
            <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  className="btn btn-ghost" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity === 0}
                  style={{ padding: '8px 12px', minWidth: '40px' }}
                >
                  -
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                  {quantity}
                </span>
                <button 
                  className="btn btn-accent" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  style={{ padding: '8px 12px', minWidth: '40px' }}
                >
                  +
                </button>
              </div>
              
              {quantity === 0 ? (
                <button 
                  className="btn btn-accent" 
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                >
                  Add to Cart
                </button>
              ) : (
                <button 
                  className="btn btn-accent" 
                  onClick={handleOrderNow}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? 'Ordering...' : 'Order Now'}
                </button>
              )}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => navigate('/menu')}>
                ← Back to Menu
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/cart')}>
                View Cart ({items.reduce((total, item) => total + item.quantity, 0)})
              </button>
            </div>
            
            {msg && <p style={{ marginTop: 12, color: msg.includes('Order placed') ? '#4ade80' : '#f87171' }}>{msg}</p>}
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            animation: 'popupSlide 0.3s ease-out'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: 'bold' }}>
              Order Complete!
            </h2>
            <p style={{ margin: '0', fontSize: '16px', opacity: 0.9 }}>
              Your order has been placed successfully
            </p>
            <p style={{ margin: '10px 0 0', fontSize: '14px', opacity: 0.8 }}>
              Redirecting to home...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}