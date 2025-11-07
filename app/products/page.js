"use client";
import ProductGrid from "../components/ProductGrid";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>
        <ProductGrid />
      </div>
    </div>
  );
}
