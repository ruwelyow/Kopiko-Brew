import React, { useState } from 'react'

export default function Contact() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMsg('Thanks for subscribing!')
      setEmail('')
    } else {
      setMsg('Please enter a valid email address.')
    }
  }

  return (
    <section className="section contact">
      <div className="container contact-card">
        <h2>Get the good stuff first</h2>
        <p>Promos, drops, and events — straight to your inbox.</p>
        <form className="form" onSubmit={submit}>
          <input id="email" name="email" type="email" placeholder="you@coffee.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className="btn btn-accent" type="submit">Subscribe</button>
        </form>
        <small className="disclaimer">By subscribing you agree to our <a href="#">Privacy Policy</a>.</small>
        {msg && <p className="msg">{msg}</p>}
      </div>
    </section>
  )
}
