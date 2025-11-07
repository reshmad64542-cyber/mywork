"use client";
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/orders', { headers });

        if (!res.ok) {
          let msg = `Server returned ${res.status}`;
          try {
            const body = await res.json();
            if (body && body.error) msg = `${msg}: ${body.error}`;
          } catch (e) {
            // ignore json parse errors
          }
          throw new Error(msg);
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="text-lg">Loading orders...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-red-600">Failed to load orders: {error}</p>
          <p className="text-sm text-gray-600 mt-2">Make sure the backend is running and `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Total: ${order.total}</p>
                {order.items && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Items:</h3>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {item.name} - Quantity: {item.quantity} - ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded shadow">
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
