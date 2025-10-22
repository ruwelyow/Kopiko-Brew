const mysql = require('mysql2/promise')

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kopiko_brew',
  port: process.env.DB_PORT || 3306
}

let connection = null

// Initialize database connection
async function initDatabase() {
  try {
    // First connect without database to create it if it doesn't exist
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    })

    // Create database if it doesn't exist
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``)
    await tempConnection.end()

    // Now connect to the specific database
    connection = await mysql.createConnection(dbConfig)
    
    // Initialize tables
    await createTables()
    
    console.log('✅ MySQL database connected successfully')
    return connection
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    throw error
  }
}

// Create tables (compatible with existing schema)
async function createTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      item_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ]

  for (const table of tables) {
    await connection.execute(table)
  }
  
  console.log('✅ Database tables created/verified')
}

// Database functions
const db = {
  async getUserByEmail(email) {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return rows[0] || null
  },

  async createUser({ firstName, lastName, email, password }) {
    const [result] = await connection.execute(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, password]
    )
    return result.insertId
  },

  async createOrder({ userId, itemId, quantity }) {
    const [result] = await connection.execute(
      'INSERT INTO orders (user_id, item_id, quantity) VALUES (?, ?, ?)',
      [userId, itemId, quantity]
    )
    return result.insertId
  },

  async getOrdersByUser(userId) {
    const [rows] = await connection.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )
    return rows
  },

  async getAllUsers() {
    const [rows] = await connection.execute(
      'SELECT id, first_name, last_name, email, created_at FROM users ORDER BY id DESC'
    )
    return rows
  },

  async getAllOrders() {
    const [rows] = await connection.execute(`
      SELECT o.*, u.first_name, u.last_name, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `)
    return rows
  },

  async close() {
    if (connection) {
      await connection.end()
      console.log('✅ Database connection closed')
    }
  }
}

// Initialize database on module load
initDatabase().catch(console.error)

module.exports = db
