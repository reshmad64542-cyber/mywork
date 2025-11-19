"use client";
import React, { useMemo } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalesChart({ data, title }) {
  if (!data) return <div className="bg-white p-6 rounded-lg shadow">Loading sales data...</div>;
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">{title || "Sales Trends"}</h3>
        <p className="text-sm text-gray-500">No sales recorded for the selected range.</p>
      </div>
    );
  }

  const chartData = useMemo(
    () => ({
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Orders',
          data: data.map(item => item.orders * 100),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      }
    ],
    }),
    [data]
  );

  const options = useMemo(
    () => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
          text: title || 'Sales Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    }),
    [title]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default React.memo(SalesChart);