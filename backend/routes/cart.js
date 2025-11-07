const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get cart items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [items] = await db.execute(`
      SELECT c.*, p.name, p.price, p.image_url,
        (c.quantity * p.price) as subtotal
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.id]);

    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if item already in cart
    const [existing] = await db.execute(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      // Update quantity
      await db.execute(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      // Add new item
      await db.execute(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item
router.put('/:product_id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      await db.execute(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [req.user.id, req.params.product_id]
      );
    } else {
      await db.execute(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, req.params.product_id]
      );
    }

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/:product_id', authenticateToken, async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.product_id]
    );

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;