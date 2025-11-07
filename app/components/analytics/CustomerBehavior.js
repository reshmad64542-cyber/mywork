"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CustomerBehavior({ data, title }) {
  if (!data) return <div className="bg-white p-6 rounded-lg shadow">Loading behavior data...</div>;

  const chartData = {
    labels: ['Session Duration', 'Page Views', 'Bounce Rate', 'Return Rate'],
    datasets: [
      {
        data: [data.sessionDuration, data.pageViews * 30, data.bounceRate, data.returnRate],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: title || 'Customer Behavior Metrics',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Doughnut data={chartData} options={options} />
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-lg">{data.sessionDuration}s</div>
          <div className="text-gray-600">Avg Session</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{data.pageViews}</div>
          <div className="text-gray-600">Avg Page Views</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{data.bounceRate}%</div>
          <div className="text-gray-600">Bounce Rate</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{data.returnRate}%</div>
          <div className="text-gray-600">Return Rate</div>
        </div>
      </div>
    </div>
  );
}