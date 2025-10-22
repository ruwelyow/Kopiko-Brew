import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>
            Bold like <span className="kopiko-accent">Kopiko</span>, smooth like your morning.
          </h1>
          <p>Small-batch espresso, caramel-kissed specials, and pastries baked at dawn.</p>
          <div className="actions">
            <Link className="btn btn-primary" to="/menu">Explore Menu</Link>
            <Link className="btn btn-ghost" to="/locations">Find a Store</Link>
          </div>
        </div>
        <div className="hero-media" role="img" aria-label="Latte art and coffee beans">
          <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" alt="latte art" />
        </div>
      </div>
    </section>
  )
}
