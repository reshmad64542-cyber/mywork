"use client";
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CustomerSegments({ data }) {
  if (!data) return <div className="bg-white p-6 rounded-lg shadow">Loading customer data...</div>;

  // Ensure all required data exists with defaults
  const {
    loyalCustomers = [],
    occasionalCustomers = [],
    repeatBuyers = [],
    customerSegments = [
      { segment: 'New', customer_count: 0, avg_spent: 0 },
      { segment: 'Regular', customer_count: 0, avg_spent: 0 },
      { segment: 'VIP', customer_count: 0, avg_spent: 0 }
    ]
  } = data;

  // Customer segments chart
  const segmentData = {
    labels: customerSegments.map(s => s.segment),
    datasets: [{
      data: customerSegments.map(s => s.customer_count),
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 2,
    }]
  };

  // Top repeat buyers chart
  const topRepeatBuyers = repeatBuyers.slice(0, 5);
  const repeatBuyerData = {
    labels: topRepeatBuyers.map(r => r.name),
    datasets: [{
      label: 'Repeat Purchases',
      data: topRepeatBuyers.map(r => r.purchase_count),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Customer Segments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">👥 Customer Segments</h3>
        <div className="h-64">
          <Doughnut 
            data={segmentData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' }
              }
            }} 
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          {customerSegments.map((segment, index) => (
            <div key={segment.segment} className="p-2 bg-gray-50 rounded">
              <div className="font-semibold text-lg">{segment.customer_count}</div>
              <div className="text-gray-600">{segment.segment}</div>
              <div className="text-xs text-green-600">₹{Math.round(segment.avg_spent)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Repeat Buyers */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🔄 Top Repeat Buyers</h3>
        <div className="h-64">
          <Bar 
            data={repeatBuyerData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        </div>
      </div>

      {/* Loyal Customers List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">⭐ Loyal Customers</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {loyalCustomers.slice(0, 5).map((customer, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.order_count} orders</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">₹{customer.total_spent.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Avg: ₹{Math.round(customer.avg_order_value)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Occasional Customers */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📅 Occasional Customers</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {occasionalCustomers.slice(0, 5).map((customer, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.order_count} orders</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-yellow-600">₹{customer.total_spent.toLocaleString()}</div>
                <div className="text-xs text-gray-500">
                  Last: {new Date(customer.last_order).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}