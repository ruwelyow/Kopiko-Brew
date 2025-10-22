const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.join(__dirname, 'data.sqlite')

const db = new sqlite3.Database(dbPath)

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      itemId INTEGER,
      quantity INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `)
})

module.exports = {
  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })
  },
  createUser({ firstName, lastName, email, password }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (firstName, lastName, email, password) VALUES (?,?,?,?)',
        [firstName, lastName, email, password],
        function (err) {
          if (err) return reject(err)
          resolve(this.lastID)
        }
      )
    })
  },
  createOrder({ userId, itemId, quantity }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO orders (userId, itemId, quantity) VALUES (?,?,?)',
        [userId, itemId, quantity],
        function (err) {
          if (err) return reject(err)
          resolve(this.lastID)
        }
      )
    })
  },
  getOrdersByUser(userId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId], (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    })
  }
}
