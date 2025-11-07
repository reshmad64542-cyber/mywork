import { NextResponse } from 'next/server';

// Mock analytics data generator
const generateAnalyticsData = (filters) => {
  const { dateRange, category, location } = filters;
  
  // Sales data
  const salesData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    revenue: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 200) + 50,
    customers: Math.floor(Math.random() * 150) + 30
  }));

  // Customer behavior data
  const behaviorData = {
    sessionDuration: Math.floor(Math.random() * 300) + 180,
    pageViews: Math.floor(Math.random() * 8) + 3,
    bounceRate: Math.floor(Math.random() * 30) + 20,
    returnRate: Math.floor(Math.random() * 40) + 30
  };

  // Product heatmap data
  const productData = [
    { name: 'Basmati Rice', views: 1250, sales: 89, category: 'Groceries' },
    { name: 'Cotton Kurta', views: 980, sales: 67, category: 'Clothing' },
    { name: 'Pressure Cooker', views: 750, sales: 45, category: 'Kitchen' },
    { name: 'Face Cream', views: 650, sales: 78, category: 'Beauty' },
    { name: 'Cricket Bat', views: 420, sales: 23, category: 'Sports' },
    { name: 'Masala Chai', views: 890, sales: 156, category: 'Beverages' }
  ];

  // Conversion funnel data
  const funnelData = [
    { stage: 'Visitors', count: 10000, percentage: 100 },
    { stage: 'Product Views', count: 6500, percentage: 65 },
    { stage: 'Add to Cart', count: 2800, percentage: 28 },
    { stage: 'Checkout', count: 1200, percentage: 12 },
    { stage: 'Purchase', count: 850, percentage: 8.5 }
  ];

  return {
    sales: salesData,
    behavior: behaviorData,
    products: productData,
    funnel: funnelData,
    summary: {
      totalRevenue: salesData.reduce((sum, day) => sum + day.revenue, 0),
      totalOrders: salesData.reduce((sum, day) => sum + day.orders, 0),
      avgOrderValue: Math.floor(salesData.reduce((sum, day) => sum + day.revenue, 0) / salesData.reduce((sum, day) => sum + day.orders, 0)),
      conversionRate: 8.5
    }
  };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      dateRange: searchParams.get('dateRange') || '30d',
      category: searchParams.get('category') || 'all',
      location: searchParams.get('location') || 'all'
    };

    const analyticsData = generateAnalyticsData(filters);
    
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}