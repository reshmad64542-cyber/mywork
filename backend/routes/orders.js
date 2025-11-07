const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, 
        GROUP_CONCAT(
          JSON_OBJECT(
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { items, shipping_address } = req.body;
    let total_amount = 0;

    // Calculate total
    for (const item of items) {
      const [products] = await connection.execute('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      total_amount += products[0].price * item.quantity;
    }

    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
      [req.user.id, total_amount, shipping_address]
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      const [products] = await connection.execute('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, products[0].price]
      );

      // Update stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();
    res.status(201).json({ message: 'Order created', orderId, total_amount });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Update order status (Admin)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;