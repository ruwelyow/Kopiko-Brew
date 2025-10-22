# MySQL Database Setup for Kopiko Brew

This guide will help you set up MySQL database with phpMyAdmin access for your Kopiko Brew application.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
npm run setup:mysql
```
This will guide you through the setup process and create the necessary database and tables.

### Option 2: Manual Setup

## 📋 Prerequisites

### Install MySQL Server

#### Windows:
- **XAMPP** (Recommended): Download from https://www.apachefriends.org/
- **WAMP**: Download from https://www.wampserver.com/
- **MySQL**: Download from https://dev.mysql.com/downloads/mysql/

#### macOS:
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

## 🔧 Configuration

### 1. Start MySQL Service
- **XAMPP**: Start Apache and MySQL from XAMPP Control Panel
- **WAMP**: Start WAMP server
- **Manual**: Start MySQL service

### 2. Access phpMyAdmin
- **XAMPP**: http://localhost/phpmyadmin
- **WAMP**: http://localhost/phpmyadmin
- **Manual**: http://localhost:8080/phpmyadmin (if installed separately)

### 3. Create Database
1. Open phpMyAdmin
2. Click "New" to create a database
3. Name it `kopiko_brew`
4. Set collation to `utf8mb4_unicode_ci`
5. Click "Create"

### 4. Environment Variables
Create a `.env` file in your project root:
```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kopiko_brew

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=4000
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  itemId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🛠️ Commands

### Start the server:
```bash
npm run start:server
```

### View database contents:
```bash
npm run inspect:mysql
```

### Setup database (if not done automatically):
```bash
npm run setup:mysql
```

## 🔍 Accessing Your Database

### phpMyAdmin
1. Open http://localhost/phpmyadmin
2. Select `kopiko_brew` database
3. Browse tables: `users` and `orders`
4. Run SQL queries in the SQL tab

### MySQL Command Line
```bash
mysql -u root -p
USE kopiko_brew;
SELECT * FROM users;
SELECT * FROM orders;
```

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Make sure MySQL service is running
   - Check if port 3306 is available
   - Verify credentials in `.env` file

2. **Database Not Found**
   - Create database manually in phpMyAdmin
   - Run `npm run setup:mysql` again

3. **Permission Denied**
   - Check MySQL user permissions
   - Ensure user has CREATE, INSERT, SELECT, UPDATE, DELETE privileges

4. **phpMyAdmin Not Loading**
   - Start Apache service (if using XAMPP/WAMP)
   - Check if phpMyAdmin is properly installed
   - Try accessing via different port

### Getting Help:
- Check MySQL error logs
- Verify `.env` configuration
- Test connection with MySQL client
- Check firewall settings

## 📈 Benefits of MySQL over SQLite

- ✅ **phpMyAdmin Access**: Web-based database management
- ✅ **Better Performance**: For larger datasets
- ✅ **Concurrent Users**: Multiple users can access simultaneously
- ✅ **Advanced Features**: Triggers, stored procedures, views
- ✅ **Backup Tools**: Built-in backup and restore functionality
- ✅ **Production Ready**: Better suited for production environments
