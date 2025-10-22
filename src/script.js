// Mount-safe small DOM helpers for the React app
try {
  const setYear = () => {
    const el = document.getElementById('year')
    if (el) el.textContent = new Date().getFullYear()
  }
  setYear()

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
        const navToggle = document.getElementById('nav-toggle')
        if (navToggle) navToggle.checked = false
      }
    })
  })

  const form = document.querySelector('.form')
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      const emailInput = document.getElementById('email')
      const email = emailInput?.value.trim() || ''
      const message = document.createElement('p')
      message.style.marginTop = '10px'
      form.querySelectorAll('.msg').forEach(m => m.remove())
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        message.textContent = ' Thanks for subscribing!'
        message.style.color = 'lightgreen'
        if (emailInput) emailInput.value = ''
      } else {
        message.textContent = ' Please enter a valid email address.'
        message.style.color = 'salmon'
      }
      message.classList.add('msg')
      form.appendChild(message)
    })
  }

  // Scroll top button
  const scrollBtn = document.createElement('button')
  scrollBtn.textContent = '↑'
  scrollBtn.setAttribute('id', 'scrollTop')
  Object.assign(scrollBtn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 14px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    background: 'var(--kopiko)',
    color: 'white',
    display: 'none',
    fontSize: '18px'
  })
  document.body.appendChild(scrollBtn)
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none'
  })
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

  const messageForm = document.querySelector('.form-flex')
  if (messageForm) {
    messageForm.addEventListener('submit', function (e) {
      e.preventDefault()
      alert(" Message submitted! We'll get back to you shortly.")
    })
  }

  document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('open-login')
    const registerBtn = document.getElementById('open-register')
    const loginModal = document.getElementById('login-modal')
    const registerModal = document.getElementById('register-modal')
    document.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', () => {
        const closeId = btn.dataset.close
        if (closeId) document.getElementById(closeId).style.display = 'none'
      })
    })
    if (loginBtn && loginModal) loginBtn.onclick = () => (loginModal.style.display = 'flex')
    if (registerBtn && registerModal) registerBtn.onclick = () => (registerModal.style.display = 'flex')
    window.onclick = (e) => {
      if (e.target.classList && e.target.classList.contains('modal')) e.target.style.display = 'none'
    }
    function showToast(message) {
      const toast = document.getElementById('toast')
      if (!toast) return
      toast.textContent = message
      toast.classList.add('show')
      setTimeout(() => toast.classList.remove('show'), 3000)
    }
    const loginForm = document.getElementById('login-form')
    if (loginForm) loginForm.addEventListener('submit', (e) => { e.preventDefault(); showToast(' Logged in successfully!'); if (loginModal) loginModal.style.display = 'none' })
    const registerForm = document.getElementById('register-form')
    if (registerForm) registerForm.addEventListener('submit', (e) => { e.preventDefault(); showToast(' Registered successfully!'); if (registerModal) registerModal.style.display = 'none' })
  })
} catch (err) {
  // fail silently in SSR or non-browser contexts
}
