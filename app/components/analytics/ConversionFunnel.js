"use client";

export default function ConversionFunnel({ data, title }) {
  if (!data) return <div className="bg-white p-6 rounded-lg shadow">Loading funnel data...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title || 'Conversion Funnel'}</h3>
      <div className="space-y-4">
        {data.map((stage, index) => {
          const width = stage.percentage;
          const isLast = index === data.length - 1;
          
          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{stage.stage}</span>
                <span className="text-sm text-gray-600">{stage.percentage}%</span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div 
                    className={`h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      isLast ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${width}%` }}
                  >
                    {stage.count.toLocaleString()}
                  </div>
                </div>
                
                {index < data.length - 1 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                  </div>
                )}
              </div>
              
              {index > 0 && (
                <div className="absolute -top-1 right-4 text-xs text-red-500">
                  -{((data[index-1].count - stage.count) / data[index-1].count * 100).toFixed(1)}%
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data[data.length - 1]?.percentage}%
          </div>
          <div className="text-sm text-gray-600">Overall Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}