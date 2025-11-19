"use client";
import React, { useMemo } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FestivalTrends({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="bg-white p-6 rounded-lg shadow">No festival data available</div>;
  }

  const { festivals, chartData } = useMemo(() => {
    const keys = Object.keys(data);
    return {
      festivals: keys,
      chartData: {
        labels: keys,
    datasets: [
      {
        label: 'Festival Revenue (₹)',
            data: keys.map(festival => data[festival].totalRevenue),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
      },
  };
  }, [data]);

  const options = useMemo(
    () => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Festival-wise Sales Performance' },
    },
    scales: { y: { beginAtZero: true } },
    }),
    []
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar data={chartData} options={options} />
      
      <div className="mt-6 space-y-4">
        <h4 className="font-semibold text-lg">🎉 Festival Insights</h4>
        {festivals.map(festival => {
          const festivalData = data[festival] || {};
          const products = Object.entries(festivalData.products || {});
          const topProduct = products.sort((a, b) => b[1].quantity - a[1].quantity)[0];
          
          return (
            <div key={festival} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h5 className="font-medium text-gray-900">{festival}</h5>
                <span className="text-green-600 font-semibold">₹{festivalData.totalRevenue.toLocaleString()}</span>
              </div>
              {topProduct ? (
                <p className="text-sm text-gray-600 mt-1">
                  Top seller: {topProduct[0]} ({topProduct[1].quantity} units)
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  No product level data available.
                </p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Orders: {festivalData.totalOrders ?? 0} • Avg order value: ₹
                {festivalData.averageOrderValue?.toLocaleString() ?? 0}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(FestivalTrends);