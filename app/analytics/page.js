"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../lib/translations";
import ProtectedRoute from "../components/ProtectedRoute";
import SalesChart from "../components/analytics/SalesChart";
import CustomerBehavior from "../components/analytics/CustomerBehavior";
import ProductHeatmap from "../components/analytics/ProductHeatmap";
import ConversionFunnel from "../components/analytics/ConversionFunnel";
import FilterPanel from "../components/analytics/FilterPanel";
import DataUpload from "../components/analytics/DataUpload";
import FestivalTrends from "../components/analytics/FestivalTrends";
import PredictionPanel from "../components/analytics/PredictionPanel";
import CustomerSegments from "../components/analytics/CustomerSegments";

export default function Analytics() {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    category: 'all',
    location: 'all'
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  useEffect(() => {
    fetchAnalyticsData();
    fetchCustomerAnalytics();
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

  const fetchCustomerAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/customer-analytics');
      const data = await response.json();
      setCustomerData(data);
    } catch (error) {
      console.error('Customer analytics fetch error:', error);
    }
  };

  const handleDataUploaded = (data) => {
    setUploadedData(data);
    // Update analytics data with uploaded data
    setAnalyticsData({
      sales: convertToSalesData(data.trends),
      behavior: generateBehaviorFromUploaded(data.trends),
      products: convertToProductData(data.trends.productTrends),
      funnel: generateFunnelFromUploaded(data.trends)
    });
  };

  const convertToSalesData = (trends) => {
    if (!trends.productTrends) return [];
    return Object.entries(trends.productTrends).slice(0, 12).map(([product, data], index) => ({
      date: new Date(2024, index, 1).toISOString().split('T')[0],
      revenue: data.totalRevenue,
      orders: Math.floor(data.totalQuantity / 10),
      customers: Math.floor(data.totalQuantity / 15)
    }));
  };

  const generateBehaviorFromUploaded = (trends) => {
    const totalProducts = Object.keys(trends.productTrends || {}).length;
    return {
      sessionDuration: Math.min(300 + totalProducts * 10, 600),
      pageViews: Math.min(3 + Math.floor(totalProducts / 5), 12),
      bounceRate: Math.max(20, 50 - totalProducts),
      returnRate: Math.min(30 + totalProducts * 2, 70)
    };
  };

  const convertToProductData = (productTrends) => {
    if (!productTrends) return [];
    return Object.entries(productTrends).map(([name, data]) => ({
      name,
      views: data.totalQuantity * 15,
      sales: data.totalQuantity,
      category: data.category
    }));
  };

  const generateFunnelFromUploaded = (trends) => {
    const totalQuantity = Object.values(trends.productTrends || {}).reduce((sum, p) => sum + p.totalQuantity, 0);
    const visitors = totalQuantity * 20;
    return [
      { stage: 'Visitors', count: visitors, percentage: 100 },
      { stage: 'Product Views', count: Math.floor(visitors * 0.65), percentage: 65 },
      { stage: 'Add to Cart', count: Math.floor(visitors * 0.28), percentage: 28 },
      { stage: 'Checkout', count: Math.floor(visitors * 0.12), percentage: 12 },
      { stage: 'Purchase', count: totalQuantity, percentage: (totalQuantity / visitors * 100).toFixed(1) }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🚀 E-Commerce Analytics & Market Trends
        </h1>
        
        <DataUpload onDataUploaded={handleDataUploaded} />
        
        {uploadedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <FestivalTrends data={uploadedData.trends?.festivalTrends} />
            <PredictionPanel predictions={uploadedData.predictions || []} />
          </div>
        )}
        
        <FilterPanel filters={filters} setFilters={setFilters} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesChart data={analyticsData?.sales} title={uploadedData ? "📊 Uploaded Data Sales Trends" : "Sales Trends"} />
          <CustomerBehavior data={analyticsData?.behavior} title={uploadedData ? "👥 Customer Insights from Data" : "Customer Behavior"} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProductHeatmap data={analyticsData?.products} title={uploadedData ? "🔥 Product Performance Analysis" : "Product Heatmap"} />
          <ConversionFunnel data={analyticsData?.funnel} title={uploadedData ? "🎯 Sales Funnel from Data" : "Conversion Funnel"} />
        </div>
        
        {customerData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Customer Behavior Analytics</h2>
            <CustomerSegments data={customerData} />
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}