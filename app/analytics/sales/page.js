"use client";
import { useState, useEffect } from 'react';
import SalesChart from '../../components/analytics/SalesChart';
import ProductHeatmap from '../../components/analytics/ProductHeatmap';
import ConversionFunnel from '../../components/analytics/ConversionFunnel';
import FilterPanel from '../../components/analytics/FilterPanel';

export default function SalesAnalytics() {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    category: 'all',
    location: 'all'
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?${new URLSearchParams(filters)}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📈 Sales Analytics
        </h1>
        
        <FilterPanel filters={filters} setFilters={setFilters} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesChart 
            data={analyticsData?.sales} 
            title="Revenue Trends"
          />
          <ConversionFunnel 
            data={analyticsData?.funnel} 
            title="Sales Conversion Funnel"
          />
        </div>
        
        <div className="mb-8">
          <ProductHeatmap 
            data={analyticsData?.products} 
            title="Product Performance"
          />
        </div>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">
              ₹{analyticsData?.sales?.reduce((sum, item) => sum + item.revenue, 0).toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Last {filters.dateRange} days</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">
              {analyticsData?.sales?.reduce((sum, item) => sum + item.orders, 0).toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Last {filters.dateRange} days</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-purple-600">
              ₹{analyticsData?.sales?.length ? 
                Math.round(analyticsData.sales.reduce((sum, item) => sum + item.revenue, 0) / 
                analyticsData.sales.reduce((sum, item) => sum + item.orders, 0)).toLocaleString() : 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Last {filters.dateRange} days</p>
          </div>
        </div>
      </div>
    </div>
  );
}