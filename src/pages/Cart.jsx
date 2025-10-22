import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../auth/AuthContext'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }

    if (items.length === 0) {
      setMessage('Your cart is empty!')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Create orders for each item in cart
      const orderPromises = items.map(item => 
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({ itemId: item.id, quantity: item.quantity })
        })
      )

      const responses = await Promise.all(orderPromises)
      const results = await Promise.all(responses.map(res => res.json()))

      // Check if all orders were successful
      const failedOrders = results.filter(result => !result.orderId)
      
      if (failedOrders.length === 0) {
        console.log('✅ Order successful, showing popup')
        clearCart()
        setShowSuccessPopup(true)
        // Redirect to home after 2 seconds
        setTimeout(() => {
          setShowSuccessPopup(false)
          navigate('/')
        }, 2000)
      } else {
        console.log('❌ Some orders failed:', failedOrders)
        setMessage('Some items could not be ordered. Please try again.')
      }
    } catch (err) {
      setMessage('Order failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="contact-card" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2>Your Cart is Empty</h2>
            <p>Add some delicious drinks to your cart to get started!</p>
            <button className="btn btn-accent" onClick={() => navigate('/menu')}>
              Browse Menu
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Shopping Cart</h2>
          <p>Review your order before checkout</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item" style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '18px',
                padding: '20px',
                marginBottom: '16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover', 
                    borderRadius: '12px' 
                  }} 
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>{item.title}</h3>
                  <p style={{ margin: '0 0 8px', color: '#e8dfd6', fontSize: '14px' }}>
                    {item.description}
                  </p>
                  <div className="price" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {item.price}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      className="btn btn-ghost" 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={{ padding: '6px 10px', minWidth: '36px' }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                      {item.quantity}
                    </span>
                    <button 
                      className="btn btn-accent" 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={{ padding: '6px 10px', minWidth: '36px' }}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="btn btn-ghost" 
                    onClick={() => removeItem(item.id)}
                    style={{ padding: '6px 10px', color: '#f87171' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button 
                className="btn btn-ghost" 
                onClick={clearCart}
                style={{ color: '#f87171' }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary" style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '18px',
            padding: '24px',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px' }}>Order Summary</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Items ({getTotalItems()})</span>
                <span>₱{getTotalPrice().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Service Fee</span>
                <span>₱0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span>Tax</span>
                <span>₱0.00</span>
              </div>
              <hr style={{ border: '1px solid rgba(255, 255, 255, 0.1)', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>₱{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="btn btn-accent full" 
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              style={{ marginBottom: '16px' }}
            >
              {loading ? 'Processing...' : user ? 'Checkout' : 'Login to Checkout'}
            </button>

            {/* Removed manual Test Popup button so popup only shows on actual checkout */}

            {!user && (
              <p style={{ fontSize: '14px', color: '#e8dfd6', textAlign: 'center' }}>
                Please login to complete your order
              </p>
            )}

            {message && (
              <p style={{ 
                marginTop: '12px', 
                color: message.includes('successfully') ? '#4ade80' : '#f87171',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {message}
              </p>
            )}
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
    </section>
  )
}
