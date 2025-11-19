"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import ProtectedRoute from "../components/ProtectedRoute";
import DataUpload from "../components/analytics/DataUpload";
import FilterPanel from "../components/analytics/FilterPanel";

const SalesChart = dynamic(() => import("../components/analytics/SalesChart"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
      Loading sales analytics…
    </div>
  ),
});

const ProductHeatmap = dynamic(
  () => import("../components/analytics/ProductHeatmap"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
        Preparing product performance…
      </div>
    ),
  }
);

const ConversionFunnel = dynamic(
  () => import("../components/analytics/ConversionFunnel"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
        Building funnel insights…
      </div>
    ),
  }
);

const CustomerBehavior = dynamic(
  () => import("../components/analytics/CustomerBehavior"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
        Summarising customer engagement…
      </div>
    ),
  }
);

const CustomerSegments = dynamic(
  () => import("../components/analytics/CustomerSegments"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
        Analysing customer cohorts…
      </div>
    ),
  }
);

const FestivalTrends = dynamic(
  () => import("../components/analytics/FestivalTrends"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
        Crunching festival moments…
      </div>
    ),
  }
);

const PredictionPanel = dynamic(
  () => import("../components/analytics/PredictionPanel"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
        Generating future insights…
      </div>
    ),
  }
);

const MarketingAnalytics = dynamic(
  () => import("../components/analytics/MarketingAnalytics"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
        Loading marketing ROI…
      </div>
    ),
  }
);

const DEFAULT_FILTERS = {
  dateRange: "30d",
  category: "all",
};

const TAB_ORDER = [
  { id: "upload", label: "Upload" },
  { id: "sales", label: "Sales" },
  { id: "products", label: "Products" },
  { id: "customers", label: "Customers" },
  { id: "segments", label: "Segments" },
  { id: "marketing", label: "Marketing" },
  { id: "predictions", label: "Predictions" },
];

export default function Analytics() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  const loadAnalytics = useCallback(async (nextFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        dateRange: nextFilters.dateRange,
        category: nextFilters.category,
      });
      const response = await fetch(`/api/analytics?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const payload = await response.json();
      setAnalytics(payload);
      setCategories(payload.filters?.categoryOptions ?? []);
    } catch (err) {
      setError(err.message || "Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics(filters);
  }, [filters, loadAnalytics]);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleUploadComplete = useCallback(
    async (payload) => {
      setUploadSummary({
        message: payload.message,
        total: payload.total,
        durationMs: payload.durationMs,
      });
      await loadAnalytics(filters);
    },
    [filters, loadAnalytics]
  );

  const salesSummary = useMemo(
    () => analytics?.sales?.summary ?? null,
    [analytics]
  );

  const salesTabContent = useMemo(() => {
    if (!analytics) return null;
    return (
      <div className="space-y-6">
        {salesSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard title="Total Revenue" value={`₹${salesSummary.totalRevenue.toLocaleString()}`} />
            <SummaryCard title="Total Orders" value={salesSummary.totalOrders.toLocaleString()} />
            <SummaryCard title="Avg Order Value" value={`₹${salesSummary.averageOrderValue.toLocaleString()}`} />
            <SummaryCard title="Transactions" value={salesSummary.totalTransactions.toLocaleString()} />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart data={analytics.sales?.daily} />
          <ConversionFunnel data={analytics.sales?.funnel} />
        </div>
        <FestivalTrends data={analytics.sales?.festivals} />
      </div>
    );
  }, [analytics, salesSummary]);

  const productsTabContent = useMemo(() => {
    if (!analytics) return null;
    return <ProductHeatmap data={analytics.products?.heatmap} />;
  }, [analytics]);

  const customersTabContent = useMemo(() => {
    if (!analytics) return null;
    return <CustomerBehavior data={analytics.customerBehavior} />;
  }, [analytics]);

  const segmentsTabContent = useMemo(() => {
    if (!analytics) return null;
    return <CustomerSegments data={analytics.customerSegments} />;
  }, [analytics]);

  const marketingTabContent = useMemo(() => {
    if (!analytics) return null;
    return <MarketingAnalytics data={analytics.marketing} />;
  }, [analytics]);

  const predictionsTabContent = useMemo(() => {
    if (!analytics) return null;
    return <PredictionPanel data={analytics.predictions} />;
  }, [analytics]);

  const renderTabContent = useMemo(() => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center bg-white rounded-lg shadow">
          <span className="text-gray-600 text-sm">
            Crunching analytics for {filters.dateRange}…
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      );
    }

    if (!analytics) {
      return null;
    }

    switch (activeTab) {
      case "upload":
        return (
          <div className="space-y-6">
            <DataUpload onUploadComplete={handleUploadComplete} />
            {uploadSummary && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {uploadSummary.message} — {uploadSummary.total} rows processed in{" "}
                {(uploadSummary.durationMs / 1000).toFixed(2)} seconds.
              </div>
            )}
          </div>
        );
      case "sales":
        return salesTabContent;
      case "products":
        return productsTabContent;
      case "customers":
        return customersTabContent;
      case "segments":
        return segmentsTabContent;
      case "marketing":
        return marketingTabContent;
      case "predictions":
        return predictionsTabContent;
      default:
        return null;
    }
  }, [
    activeTab,
    analytics,
    customersTabContent,
    error,
    filters.dateRange,
    handleUploadComplete,
    loading,
    marketingTabContent,
    productsTabContent,
    predictionsTabContent,
    salesTabContent,
    segmentsTabContent,
    uploadSummary,
  ]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              E-Commerce Intelligence Dashboard
        </h1>
            <p className="text-sm text-gray-600">
              Upload data, apply filters, and drill into insights without waiting for heavy charts to load upfront.
            </p>
          </header>
        
          <FilterPanel
            filters={filters}
            setFilters={handleFiltersChange}
            categories={categories}
          />
        
          <nav className="flex flex-wrap gap-2">
            {TAB_ORDER.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {renderTabContent}
      </div>
    </div>
    </ProtectedRoute>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
        {title}
      </div>
      <div className="text-2xl font-semibold text-gray-900 mt-2">{value}</div>
    </div>
  );
}
