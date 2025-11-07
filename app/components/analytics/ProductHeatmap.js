"use client";

export default function ProductHeatmap({ data, title }) {
  if (!data) return <div className="bg-white p-6 rounded-lg shadow">Loading product data...</div>;

  const maxViews = Math.max(...data.map(item => item.views));
  
  const getIntensity = (views) => {
    const intensity = views / maxViews;
    return `rgba(59, 130, 246, ${intensity})`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title || 'Product Performance Heatmap'}</h3>
      <div className="space-y-3">
        {data.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border" 
               style={{ backgroundColor: getIntensity(product.views) }}>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-sm text-gray-600">{product.category}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{product.views} views</div>
              <div className="text-sm text-gray-600">{product.sales} sales</div>
            </div>
            <div className="ml-4 text-right">
              <div className="text-sm font-medium">
                {((product.sales / product.views) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">conversion</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Low Activity</span>
        <div className="flex space-x-1">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
            <div key={intensity} className="w-4 h-4 rounded" 
                 style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}></div>
          ))}
        </div>
        <span>High Activity</span>
      </div>
    </div>
  );
}