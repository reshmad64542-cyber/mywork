const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const analyticsRoutes = require('./routes/analytics');
const analyticsSalesRoutes = require('./routes/analytics-sales');
const analyticsProductsRoutes = require('./routes/analytics-products');
const uploadDataRoutes = require('./routes/upload-data');
const uploadEchoRoutes = require('./routes/upload-echo');
const analyticsMarketingRoutes = require('./routes/analytics-marketing');
const downloadReportRoutes = require('./routes/download-report');
const customerAnalyticsRoutes = require('./routes/customer-analytics');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/analytics', analyticsSalesRoutes);
app.use('/api/analytics', analyticsProductsRoutes);
app.use('/api/analytics', analyticsMarketingRoutes);
app.use('/api/upload-data', uploadDataRoutes);
app.use('/api/upload-echo', uploadEchoRoutes);
app.use('/api/download-report', downloadReportRoutes);
app.use('/api/customer-analytics', customerAnalyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  }
};

startServer(PORT);