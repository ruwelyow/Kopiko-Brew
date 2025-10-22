import React from 'react'

export default function Story() {
  return (
    <section className="section split">
      <div className="container split-grid">
        <div className="split-media">
          <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200" alt="barista" />
        </div>
        <div className="split-copy">
          <h2>Our Story</h2>
          <p>We’re fueled by the punchy, caramel-forward flavor profile that made Kopiko a cult favorite.</p>
          <ul className="checks">
            <li>Direct-trade beans from small farms</li>
            <li>House-made syrups and caramel</li>
            <li>Compostable cups & eco packaging</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
