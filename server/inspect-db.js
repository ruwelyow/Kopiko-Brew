const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.join(__dirname, 'data.sqlite')

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message)
    process.exit(1)
  }
})

function printTable(name) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${name} ORDER BY id DESC`, (err, rows) => {
      if (err) return reject(err)
      console.log(`\n=== ${name.toUpperCase()} (${rows.length}) ===`)
      console.table(rows)
      resolve()
    })
  })
}

;(async () => {
  try {
    await printTable('users')
    await printTable('orders')
  } catch (err) {
    console.error('Error reading tables:', err.message)
  } finally {
    db.close()
  }
})()
