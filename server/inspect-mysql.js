const mysql = require('mysql2/promise')

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kopiko_brew',
  port: process.env.DB_PORT || 3306
}

async function inspectDatabase() {
  let connection = null
  
  try {
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Connected to MySQL database:', dbConfig.database)
    
    // Get users
    const [users] = await connection.execute('SELECT * FROM users ORDER BY id DESC')
    console.log(`\n=== USERS (${users.length}) ===`)
    console.table(users)
    
    // Get orders with user info
    const [orders] = await connection.execute(`
      SELECT o.id, o.user_id, o.item_id, o.quantity, o.created_at,
             u.first_name, u.last_name, u.email
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `)
    console.log(`\n=== ORDERS (${orders.length}) ===`)
    console.table(orders)
    
    // Database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db')
    console.log(`\n=== DATABASE INFO ===`)
    console.log(`Current Database: ${dbInfo[0].current_db}`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Make sure MySQL is running and the database exists!')
    console.log('💡 You can create the database manually in phpMyAdmin if needed.')
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

inspectDatabase()
