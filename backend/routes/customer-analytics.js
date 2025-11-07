const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get customer behavior analytics
router.get('/', async (req, res) => {
  try {
    // Check if tables exist
    const [tables] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name IN ('users', 'orders', 'order_items', 'products')
    `);

    if (tables[0].count < 4) {
      return res.json({
        loyalCustomers: [],
        occasionalCustomers: [],
        repeatBuyers: [],
        customerSegments: [
          { segment: 'New', customer_count: 0, avg_spent: 0 },
          { segment: 'Occasional', customer_count: 0, avg_spent: 0 },
          { segment: 'Loyal', customer_count: 0, avg_spent: 0 }
        ]
      });
    }

    // Loyal customers (3+ orders)
    const [loyalCustomers] = await pool.execute(`
      SELECT u.name, u.email, COUNT(o.id) as order_count, 
             SUM(o.total_amount) as total_spent,
             AVG(o.total_amount) as avg_order_value
      FROM users u 
      JOIN orders o ON u.id = o.user_id 
      GROUP BY u.id 
      HAVING order_count >= 3
      ORDER BY total_spent DESC
    `);

    // Occasional customers (1-2 orders)
    const [occasionalCustomers] = await pool.execute(`
      SELECT u.name, u.email, COUNT(o.id) as order_count,
             SUM(o.total_amount) as total_spent,
             MAX(o.created_at) as last_order
      FROM users u 
      JOIN orders o ON u.id = o.user_id 
      GROUP BY u.id 
      HAVING order_count BETWEEN 1 AND 2
      ORDER BY last_order DESC
    `);

    // Repeat product buyers
    const [repeatBuyers] = await pool.execute(`
      SELECT u.name, u.email, p.name as product_name,
             COUNT(oi.id) as purchase_count,
             SUM(oi.quantity) as total_quantity
      FROM users u
      JOIN orders o ON u.id = o.user_id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY u.id, p.id
      HAVING purchase_count > 1
      ORDER BY purchase_count DESC, total_quantity DESC
    `);

    // Customer segments summary
    const [customerSegments] = await pool.execute(`
      SELECT 
        CASE 
          WHEN order_count >= 3 THEN 'Loyal'
          WHEN order_count BETWEEN 1 AND 2 THEN 'Occasional'
          ELSE 'New'
        END as segment,
        COUNT(*) as customer_count,
        AVG(total_spent) as avg_spent
      FROM (
        SELECT u.id, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
        FROM users u 
        LEFT JOIN orders o ON u.id = o.user_id 
        GROUP BY u.id
      ) customer_stats
      GROUP BY segment
    `);

    res.json({
      loyalCustomers,
      occasionalCustomers,
      repeatBuyers,
      customerSegments
    });

  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch customer analytics' });
  }
});

module.exports = router;