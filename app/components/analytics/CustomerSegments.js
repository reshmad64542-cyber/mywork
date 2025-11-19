"use client";
import React, { useMemo } from "react";

const defaultSummary = {
  newCustomers: { customers: 0, totalRevenue: 0, avgRevenue: 0, avgOrders: 0 },
  occasionalCustomers: {
    customers: 0,
    totalRevenue: 0,
    avgRevenue: 0,
    avgOrders: 0,
  },
  loyalCustomers: { customers: 0, totalRevenue: 0, avgRevenue: 0, avgOrders: 0 },
  atRiskCustomers: { customers: 0, totalRevenue: 0, avgRevenue: 0, avgOrders: 0 },
};

function CustomerSegments({ data }) {
  if (!data) {
  return (
      <div className="bg-white p-6 rounded-lg shadow">
        Loading customer segmentation…
      </div>
    );
  }

  const summary = data.summary ?? defaultSummary;
  const segmentDistribution = data.segmentDistribution ?? [];
  const spotlight = data.spotlight ?? { loyal: [], atRisk: [] };

  const segments = useMemo(
    () => [
      {
        label: "New Customers",
        key: "newCustomers",
        accent: "bg-blue-50 border-blue-100 text-blue-700",
      },
      {
        label: "Occasional Customers",
        key: "occasionalCustomers",
        accent: "bg-amber-50 border-amber-100 text-amber-700",
      },
      {
        label: "Loyal Customers",
        key: "loyalCustomers",
        accent: "bg-emerald-50 border-emerald-100 text-emerald-700",
      },
      {
        label: "At-risk Customers",
        key: "atRiskCustomers",
        accent: "bg-rose-50 border-rose-100 text-rose-700",
      },
    ],
    []
  );

  const totalSegments = useMemo(
    () => segmentDistribution.reduce((sum, item) => sum + item.count, 0),
    [segmentDistribution]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Segment Overview
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Recency, frequency, and monetary (RFM) inspired grouping using product-level sales
            behaviour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((segment) => {
            const metrics = summary?.[segment.key] ?? {
              customers: 0,
              totalRevenue: 0,
              avgRevenue: 0,
              avgOrders: 0,
            };
            return (
              <div
                key={segment.key}
                className={`rounded-xl border p-4 ${segment.accent}`}
              >
                <div className="text-sm font-medium">{segment.label}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-3xl font-semibold">
                    {metrics.customers}
                  </div>
                  <div className="text-xs uppercase tracking-wide opacity-70">
                    cohorts
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-medium">
                  <div>
                    <div className="text-gray-500">Revenue</div>
                    <div>₹{metrics.totalRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Avg Spend</div>
                    <div>₹{metrics.avgRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Avg Orders</div>
                    <div>{metrics.avgOrders}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">
            Segment Distribution
          </h4>
          <div className="space-y-2">
            {segmentDistribution.map((entry) => {
              const percentage =
                totalSegments === 0
                  ? 0
                  : Math.round((entry.count / totalSegments) * 100);
              return (
                <div key={entry.segment}>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{entry.segment}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Spotlight: Loyal Cohorts
          </h3>
          <p className="text-sm text-gray-500">
            Highest revenue generating product-driven customer personas.
          </p>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {spotlight.loyal.length === 0 && (
            <div className="text-sm text-gray-500">
              Upload more data to identify loyal customers.
      </div>
          )}
          {spotlight.loyal.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-center rounded-lg border border-emerald-100 bg-emerald-50 p-3"
            >
              <div>
                <div className="font-medium text-emerald-700">
                  {item.name}
                </div>
                <div className="text-xs text-emerald-600">
                  {item.orderCount} repeat orders
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-emerald-700">
                  ₹{item.totalSpent.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-500">
                  Last purchase {new Date(item.lastPurchase).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
      </div>

              <div>
          <h4 className="font-semibold text-gray-900">
            At-risk Alerts
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {spotlight.atRisk.length === 0 && (
              <div className="text-sm text-gray-500">
                No at-risk cohorts detected in the selected range.
              </div>
            )}
            {spotlight.atRisk.map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-rose-100 bg-rose-50 p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-rose-700">
                    {item.name}
                  </div>
                  <div className="text-xs text-rose-500">
                    Last seen {new Date(item.lastPurchase).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm font-semibold text-rose-600">
                  ₹{item.totalSpent.toLocaleString()}
                </div>
              </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CustomerSegments);
