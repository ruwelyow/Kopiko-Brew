import React from 'react'

export default function Locations() {
  return (
    <section className="section alt">
      <div className="container">
        <div className="section-head">
          <h2>Locations</h2>
          <p>Come say hi — we’ll have your favorite ready.</p>
        </div>
        <div className="locations-grid">
          <div className="loc"><h3>Cabuyao Laguna</h3><p>Brgy. Mamatid, Laguna</p></div>
          <div className="loc"><h3>Calamba City</h3><p>Parian Highway, Laguna</p></div>
          <div className="loc"><h3>Los Banos</h3><p>UP Los Banos, Laguna</p></div>
        </div>
        <div className="map-container">
          <iframe title="map" src="https://www.google.com/maps/embed?..." width="100%" height="300" style={{ border: 0, borderRadius: 12 }} />
        </div>
      </div>
    </section>
  )
}
