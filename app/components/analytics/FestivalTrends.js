"use client";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FestivalTrends({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="bg-white p-6 rounded-lg shadow">No festival data available</div>;
  }

  const festivals = Object.keys(data);
  const revenues = festivals.map(festival => data[festival].totalRevenue);

  const chartData = {
    labels: festivals,
    datasets: [
      {
        label: 'Festival Revenue (₹)',
        data: revenues,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Festival-wise Sales Performance' },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar data={chartData} options={options} />
      
      <div className="mt-6 space-y-4">
        <h4 className="font-semibold text-lg">🎉 Festival Insights</h4>
        {festivals.map(festival => {
          const festivalData = data[festival];
          const topProduct = Object.entries(festivalData.products)
            .sort((a, b) => b[1].quantity - a[1].quantity)[0];
          
          return (
            <div key={festival} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h5 className="font-medium text-gray-900">{festival}</h5>
                <span className="text-green-600 font-semibold">₹{festivalData.totalRevenue.toLocaleString()}</span>
              </div>
              {topProduct && (
                <p className="text-sm text-gray-600 mt-1">
                  Top seller: {topProduct[0]} ({topProduct[1].quantity} units)
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}