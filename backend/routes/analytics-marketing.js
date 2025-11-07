const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get marketing analytics data
router.get('/marketing', async (req, res) => {
  const { dateRange = '30d', category = 'all', channel = 'all' } = req.query;
  
  try {
    // First try to get real data from database
    try {
      // Add your database queries here when the marketing data tables are ready
      throw new Error('No marketing data in database yet');
    } catch (dbError) {
      console.log('Using sample data due to:', dbError.message);
    }

    // Return sample data for now
    const sampleData = {
      summary: {
        totalSpend: 250000,
        totalRevenue: 750000,
        roi: 3,
        cac: 500
      },
      channels: [
        {
          name: 'Social Media',
          spend: 80000,
          revenue: 280000,
          roi: 3.5,
          conversions: 560
        },
        {
          name: 'Search Ads',
          spend: 60000,
          revenue: 210000,
          roi: 3.5,
          conversions: 420
        },
        {
          name: 'Email Marketing',
          spend: 30000,
          revenue: 120000,
          roi: 4,
          conversions: 240
        },
        {
          name: 'Display Ads',
          spend: 40000,
          revenue: 80000,
          roi: 2,
          conversions: 160
        },
        {
          name: 'Content Marketing',
          spend: 40000,
          revenue: 60000,
          roi: 1.5,
          conversions: 120
        }
      ],
      campaigns: [
        {
          name: 'Summer Sale',
          channel: 'Multi-channel',
          status: 'Active',
          budget: 100000,
          spend: 80000,
          revenue: 320000,
          roi: 4
        },
        {
          name: 'New Product Launch',
          channel: 'Social Media',
          status: 'Active',
          budget: 50000,
          spend: 45000,
          revenue: 135000,
          roi: 3
        },
        {
          name: 'Holiday Season',
          channel: 'Display Ads',
          status: 'Scheduled',
          budget: 75000,
          spend: 0,
          revenue: 0,
          roi: 0
        },
        {
          name: 'Customer Retention',
          channel: 'Email',
          status: 'Active',
          budget: 25000,
          spend: 20000,
          revenue: 80000,
          roi: 4
        },
        {
          name: 'Brand Awareness',
          channel: 'Display Ads',
          status: 'Paused',
          budget: 30000,
          spend: 15000,
          revenue: 22500,
          roi: 1.5
        }
      ]
    };

    res.json(sampleData);
  } catch (error) {
    console.error('Marketing analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch marketing analytics' });
  }
});

module.exports = router;