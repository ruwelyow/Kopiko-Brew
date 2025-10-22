#!/usr/bin/env node

const mysql = require('mysql2/promise')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupMySQL() {
  console.log('🚀 MySQL Database Setup for Kopiko Brew')
  console.log('==========================================\n')
  
  try {
    // Get database configuration
    const host = await question('MySQL Host (default: localhost): ') || 'localhost'
    const port = await question('MySQL Port (default: 3306): ') || '3306'
    const user = await question('MySQL Username (default: root): ') || 'root'
    const password = await question('MySQL Password: ')
    const database = await question('Database Name (default: kopiko_brew): ') || 'kopiko_brew'
    
    console.log('\n⏳ Testing connection...')
    
    // Test connection
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password
    })
    
    console.log('✅ Connection successful!')
    
    // Create database
    console.log('⏳ Creating database...')
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``)
    console.log(`✅ Database '${database}' created/verified`)
    
    // Connect to the specific database
    await connection.end()
    const dbConnection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database
    })
    
    // Create tables
    console.log('⏳ Creating tables...')
    
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        itemId INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )`
    ]
    
    for (const table of tables) {
      await dbConnection.execute(table)
    }
    
    console.log('✅ Tables created successfully!')
    
    // Create .env file
    const envContent = `# MySQL Database Configuration
DB_HOST=${host}
DB_PORT=${port}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=4000
`
    
    const fs = require('fs')
    fs.writeFileSync('.env', envContent)
    console.log('✅ Created .env file with database configuration')
    
    await dbConnection.end()
    
    console.log('\n🎉 Setup Complete!')
    console.log('==================')
    console.log(`Database: ${database}`)
    console.log(`Host: ${host}:${port}`)
    console.log(`User: ${user}`)
    console.log('\n📝 Next Steps:')
    console.log('1. Install phpMyAdmin or use MySQL Workbench')
    console.log('2. Access your database at: http://localhost/phpmyadmin (if using XAMPP/WAMP)')
    console.log('3. Run: npm run start:server')
    console.log('4. Run: node server/inspect-mysql.js (to view data)')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('\n💡 Common issues:')
    console.log('- MySQL server not running')
    console.log('- Wrong credentials')
    console.log('- MySQL not installed')
    console.log('\n🔧 Solutions:')
    console.log('- Install XAMPP/WAMP/MAMP for easy MySQL setup')
    console.log('- Or install MySQL directly from mysql.com')
  } finally {
    rl.close()
  }
}

setupMySQL()
