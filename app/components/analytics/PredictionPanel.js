"use client";
import { useState, useEffect } from "react";

export default function PredictionPanel() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock predictions data
    setPredictions([
      {
        id: 1,
        type: 'festival',
        festival: 'Diwali',
        prediction: 'Electronics and decorative items expected to increase by 40%',
        confidence: 85
      },
      {
        id: 2,
        type: 'seasonal',
        prediction: 'Winter clothing sales projected to peak next month',
        confidence: 78
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="bg-white p-6 rounded-lg shadow">Loading predictions...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">🔮 Sales Predictions</h3>
      {predictions.length > 0 ? (
        <div className="space-y-3">
          {predictions.map((pred) => (
            <div key={pred.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-700">{pred.prediction}</p>
              <p className="text-xs text-gray-500 mt-1">Confidence: {pred.confidence}%</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No predictions available. Upload sales data to generate predictions.</p>
      )}
    </div>
  );
}