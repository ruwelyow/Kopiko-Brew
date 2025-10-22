const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./mysql-db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

app.use(cors())
app.use(bodyParser.json())

// Simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Register
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  if (!email || !password || !firstName) return res.status(400).json({ message: 'Missing fields' })
  const existing = await db.getUserByEmail(email)
  if (existing) return res.status(400).json({ message: 'Email already registered' })
  const hash = await bcrypt.hash(password, 8)
  const userId = await db.createUser({ firstName, lastName, email, password: hash })
  const token = jwt.sign({ id: userId }, JWT_SECRET)
  res.json({ ok: true, token, user: { id: userId, firstName, lastName, email } })
})

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' })
  const user = await db.getUserByEmail(email)
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id }, JWT_SECRET)
  res.json({ ok: true, token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } })
})

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Unauthorized' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Unauthorized' })
  const token = parts[1]
  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.userId = data.id
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// Place an order
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { itemId, quantity = 1 } = req.body
  if (!itemId) return res.status(400).json({ message: 'Missing itemId' })
  const orderId = await db.createOrder({ userId: req.userId, itemId, quantity })
  res.json({ ok: true, orderId })
})

// Get user's orders
app.get('/api/orders', authMiddleware, async (req, res) => {
  const orders = await db.getOrdersByUser(req.userId)
  res.json({ ok: true, orders })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
