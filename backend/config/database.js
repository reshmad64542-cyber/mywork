const mysql = require('mysql2');
require('dotenv').config();

// Create pool with database specified
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_analytics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Initialize database tables
const initDatabase = async () => {
  try {
    // First create database without specifying it
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }).promise();
    
    const tempConnection = await tempPool.getConnection();
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ecommerce_analytics'}`);
    tempConnection.release();
    tempPool.end();
    
    // Now use the main pool with database specified
    const connection = await promisePool.getConnection();
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sales_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        product VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        festival VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('festival', 'seasonal') NOT NULL,
        festival VARCHAR(100) DEFAULT NULL,
        product VARCHAR(255) DEFAULT NULL,
        prediction TEXT NOT NULL,
        confidence INT NOT NULL,
        revenue DECIMAL(12,2) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS festival_trends (
        id INT AUTO_INCREMENT PRIMARY KEY,
        festival VARCHAR(100) NOT NULL,
        total_revenue DECIMAL(12,2) NOT NULL,
        total_quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_festival (festival)
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { pool: promisePool, initDatabase };