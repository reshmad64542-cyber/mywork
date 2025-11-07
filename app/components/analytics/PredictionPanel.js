"use client";
import { useState } from "react";

export default function PredictionPanel({ predictions, onDownload }) {
  const [selectedType, setSelectedType] = useState('all');

  const filteredPredictions = selectedType === 'all' 
    ? predictions 
    : predictions.filter(p => p.type === selectedType);

  const handleDownload = async (format) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/api/download-report?format=${format}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🔮 AI Predictions & Insights</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleDownload('csv')}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            📊 CSV
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            📄 PDF
          </button>
        </div>
      </div>

      <div className="mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Predictions</option>
          <option value="festival">Festival Trends</option>
          <option value="seasonal">Seasonal Patterns</option>
        </select>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPredictions.map((prediction, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prediction.type === 'festival' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {prediction.type === 'festival' ? '🎉 Festival' : '📅 Seasonal'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {prediction.confidence}% confidence
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{prediction.prediction}</p>
                {prediction.revenue && (
                  <p className="text-sm text-green-600 mt-1">
                    Revenue Impact: ₹{prediction.revenue.toLocaleString()}
                  </p>
                )}
              </div>
              <div className={`w-3 h-3 rounded-full ${
                prediction.confidence > 80 ? 'bg-green-500' : 
                prediction.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
          </div>
        ))}
      </div>

      {filteredPredictions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No predictions available. Upload sales data to generate insights.</p>
        </div>
      )}
    </div>
  );
}