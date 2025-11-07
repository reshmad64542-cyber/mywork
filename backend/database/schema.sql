-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_analytics;
USE ecommerce_analytics;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    stock INT DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Sales data table for analytics
CREATE TABLE sales_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    product VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    festival VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions table for analytics
CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('festival', 'seasonal') NOT NULL,
    festival VARCHAR(100) DEFAULT NULL,
    product VARCHAR(255) DEFAULT NULL,
    prediction TEXT NOT NULL,
    confidence INT NOT NULL,
    revenue DECIMAL(12,2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Festival trends table for analytics
CREATE TABLE festival_trends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    festival VARCHAR(100) NOT NULL,
    total_revenue DECIMAL(12,2) NOT NULL,
    total_quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_festival (festival)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Fashion and apparel'),
('Home & Garden', 'Home improvement and garden supplies'),
('Sports', 'Sports equipment and accessories'),
('Books', 'Books and educational materials'),
('Beauty', 'Beauty and personal care products');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, stock) VALUES
('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, 1, 50),
('Cotton T-Shirt', 'Comfortable cotton t-shirt in various colors', 29.99, 2, 100),
('Coffee Maker', 'Automatic coffee maker with programmable timer', 149.99, 3, 25),
('Running Shoes', 'Professional running shoes for athletes', 89.99, 4, 75),
('JavaScript Guide', 'Complete guide to JavaScript programming', 39.99, 5, 30),
('Face Cream', 'Anti-aging face cream with natural ingredients', 59.99, 6, 40);

-- Insert sample users
INSERT INTO users (name, email, password, role, email_verified) VALUES
('Admin User', 'admin@shopsphere.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE),
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', TRUE),
('Jane Smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', TRUE),
('Mike Johnson', 'mike@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', TRUE);

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status) VALUES
(2, 129.98, 'delivered'),
(2, 89.99, 'delivered'),
(2, 199.97, 'delivered'),
(2, 59.99, 'shipped'),
(3, 149.99, 'delivered'),
(3, 29.99, 'delivered'),
(4, 99.99, 'delivered');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 99.99),
(1, 2, 1, 29.99),
(2, 4, 1, 89.99),
(3, 1, 1, 99.99),
(3, 3, 1, 149.99),
(4, 6, 1, 59.99),
(5, 3, 1, 149.99),
(6, 2, 1, 29.99),
(7, 1, 1, 99.99);