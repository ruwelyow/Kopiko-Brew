const sqlite3 = require('sqlite3').verbose()
const mysql = require('mysql2/promise')
const path = require('path')

// SQLite database path
const sqlitePath = path.join(__dirname, 'data.sqlite')

// MySQL configuration
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kopiko_brew',
  port: process.env.DB_PORT || 3306
}

async function migrateUsers() {
  console.log('🔄 Starting user migration from SQLite to MySQL...')
  
  let sqliteDb = null
  let mysqlConnection = null
  
  try {
    // Connect to SQLite database
    console.log('📖 Reading from SQLite database...')
    sqliteDb = new sqlite3.Database(sqlitePath)
    
    // Get all users from SQLite
    const sqliteUsers = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM users', (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    })
    
    console.log(`📊 Found ${sqliteUsers.length} users in SQLite`)
    
    if (sqliteUsers.length === 0) {
      console.log('ℹ️  No users to migrate')
      return
    }
    
    // Connect to MySQL database
    console.log('🔌 Connecting to MySQL database...')
    mysqlConnection = await mysql.createConnection(mysqlConfig)
    
    // Check if MySQL users table is empty
    const [existingUsers] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM users')
    const userCount = existingUsers[0].count
    
    if (userCount > 0) {
      console.log(`⚠️  MySQL database already has ${userCount} users`)
      const readline = require('readline')
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      const answer = await new Promise((resolve) => {
        rl.question('Do you want to continue and add SQLite users? (y/N): ', resolve)
      })
      rl.close()
      
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Migration cancelled')
        return
      }
    }
    
    // Migrate users
    console.log('⏳ Migrating users...')
    let migratedCount = 0
    let skippedCount = 0
    
    for (const user of sqliteUsers) {
      try {
        // Check if user already exists in MySQL
        const [existingUser] = await mysqlConnection.execute(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        )
        
        if (existingUser.length > 0) {
          console.log(`⏭️  Skipping ${user.email} (already exists)`)
          skippedCount++
          continue
        }
        
        // Insert user into MySQL (handle different column names)
        await mysqlConnection.execute(
          'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
          [user.firstName, user.lastName, user.email, user.password]
        )
        
        console.log(`✅ Migrated: ${user.firstName} ${user.lastName} (${user.email})`)
        migratedCount++
        
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error.message)
      }
    }
    
    console.log('\n📈 Migration Summary:')
    console.log(`✅ Successfully migrated: ${migratedCount} users`)
    console.log(`⏭️  Skipped (already exist): ${skippedCount} users`)
    console.log(`📊 Total SQLite users: ${sqliteUsers.length}`)
    
    // Migrate orders if they exist
    console.log('\n🔄 Checking for orders to migrate...')
    const sqliteOrders = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM orders', (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    })
    
    if (sqliteOrders.length > 0) {
      console.log(`📊 Found ${sqliteOrders.length} orders in SQLite`)
      
      let migratedOrders = 0
      for (const order of sqliteOrders) {
        try {
          // Get the corresponding MySQL user ID
          const [mysqlUser] = await mysqlConnection.execute(
            'SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = ? LIMIT 1)',
            [order.userId]
          )
          
          if (mysqlUser.length > 0) {
            await mysqlConnection.execute(
              'INSERT INTO orders (userId, itemId, quantity, createdAt) VALUES (?, ?, ?, ?)',
              [mysqlUser[0].id, order.itemId, order.quantity, order.createdAt]
            )
            migratedOrders++
          }
        } catch (error) {
          console.error(`❌ Error migrating order ${order.id}:`, error.message)
        }
      }
      
      console.log(`✅ Migrated ${migratedOrders} orders`)
    } else {
      console.log('ℹ️  No orders to migrate')
    }
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('💡 You can now view your data in phpMyAdmin or run: npm run inspect:mysql')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n💡 Make sure:')
    console.log('- SQLite database exists at:', sqlitePath)
    console.log('- MySQL server is running')
    console.log('- MySQL database is created')
    console.log('- .env file is configured correctly')
  } finally {
    if (sqliteDb) {
      sqliteDb.close()
    }
    if (mysqlConnection) {
      await mysqlConnection.end()
    }
  }
}

migrateUsers()
