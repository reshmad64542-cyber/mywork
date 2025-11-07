const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Sales analytics
router.get('/sales', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Daily sales for last 30 days
    const [dailySales] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Monthly sales for last 12 months
    const [monthlySales] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);

    // Top products
    const [topProducts] = await db.execute(`
      SELECT 
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    res.json({
      dailySales,
      monthlySales,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer analytics
router.get('/customers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Top customers by revenue
    const [topCustomers] = await db.execute(`
      SELECT 
        u.name,
        u.email,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_spent,
        MAX(o.created_at) as last_order
      FROM users u
      JOIN orders o ON u.id = o.user_id
      GROUP BY u.id, u.name, u.email
      ORDER BY total_spent DESC
      LIMIT 10
    `);

    // Customer segmentation (RFM analysis)
    const [customerSegments] = await db.execute(`
      SELECT 
        CASE 
          WHEN DATEDIFF(NOW(), MAX(o.created_at)) <= 30 AND COUNT(o.id) >= 3 AND SUM(o.total_amount) >= 300 THEN 'Loyal'
          WHEN DATEDIFF(NOW(), MAX(o.created_at)) <= 90 AND COUNT(o.id) >= 2 THEN 'Occasional'
          ELSE 'One-time'
        END as segment,
        COUNT(*) as customer_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY segment
    `);

    res.json({
      topCustomers,
      customerSegments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard overview
router.get('/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total stats
    const [totalStats] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders) as total_revenue
    `);

    // Recent orders
    const [recentOrders] = await db.execute(`
      SELECT 
        o.id,
        u.name as customer_name,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // Low stock products
    const [lowStock] = await db.execute(`
      SELECT name, stock
      FROM products
      WHERE stock < 10
      ORDER BY stock ASC
      LIMIT 5
    `);

    res.json({
      stats: totalStats[0],
      recentOrders,
      lowStock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;