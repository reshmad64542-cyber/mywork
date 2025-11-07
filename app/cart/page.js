"use client";
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to read a simple cart from localStorage (if the app stores it there).
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="min-h-screen p-8">Loading cart...</div>;

  if (!items || items.length === 0) return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>
        <div className="bg-white p-6 rounded shadow">
          <p>Your cart is empty.</p>
        </div>
      </div>
    </div>
  );

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>

        <div className="bg-white p-6 rounded shadow">
          <ul className="space-y-4">
            {items.map((it, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{it.name || 'Unnamed product'}</div>
                  <div className="text-sm text-gray-600">Qty: {it.quantity || 1}</div>
                </div>
                <div className="text-right">₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</div>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right font-semibold">Total: ₹{total.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
}
