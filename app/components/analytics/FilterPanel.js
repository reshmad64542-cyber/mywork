"use client";

export default function FilterPanel({ filters, setFilters, categories = [] }) {
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Filters & Segmentation</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select 
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Category
          </label>
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilters({ dateRange: '30d', category: 'all' })}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Reset Filters
        </button>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Quick Filters:</span>
          <button 
            onClick={() => handleFilterChange('dateRange', '7d')}
            className="text-blue-600 hover:underline"
          >
            This Week
          </button>
          <button 
            onClick={() => handleFilterChange('dateRange', '30d')}
            className="text-blue-600 hover:underline"
          >
            This Month
          </button>
        </div>
      </div>
    </div>
  );
}