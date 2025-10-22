import React from 'react'
import { Link } from 'react-router-dom'
import menuData from '../data/menu'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const { addItem } = useCart()

  const handleAddToCart = (item) => {
    addItem(item)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Signature Drinks</h2>
          <p>Classic espresso and Kopiko-inspired creations.</p>
        </div>
        <div className="cards">
          {menuData.map(item => (
            <article key={item.id} className="card">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="price">{item.price}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <Link to={`/menu/${item.id}`} className="btn btn-ghost" style={{ flex: 1 }}>
                    View Details
                  </Link>
                  <button 
                    className="btn btn-accent" 
                    onClick={() => handleAddToCart(item)}
                    style={{ flex: 1 }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
