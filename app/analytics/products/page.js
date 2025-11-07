"use client";
import { useState, useEffect } from 'react';
import ProductHeatmap from '../../components/analytics/ProductHeatmap';
import FilterPanel from '../../components/analytics/FilterPanel';

export default function ProductAnalytics() {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    category: 'all',
    location: 'all'
  });
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, [filters]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/products?${new URLSearchParams(filters)}`);
      const data = await response.json();
      setProductData(data);
    } catch (error) {
      console.error('Product analytics fetch error:', error);
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
          📦 Product Analytics
        </h1>
        
        <FilterPanel filters={filters} setFilters={setFilters} />
        
        {/* Product Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">
              {productData?.summary?.totalProducts || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Active products</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-green-600">
              {productData?.summary?.totalViews?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Last {filters.dateRange} days</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-purple-600">
              {productData?.summary?.totalSales?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Units sold</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-orange-600">
              {productData?.summary?.conversionRate?.toFixed(1) || 0}%
            </p>
            <p className="text-sm text-gray-500 mt-2">Views to sales</p>
          </div>
        </div>

        {/* Product Performance Heatmap */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Product Performance Heatmap</h2>
          <ProductHeatmap 
            data={productData?.products} 
            title="Product Performance by Views and Sales"
          />
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6">Top Performing Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productData?.products?.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.views.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((product.sales / product.views) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}