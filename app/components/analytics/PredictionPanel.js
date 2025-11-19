"use client";
import React, { useMemo } from "react";

function PredictionPanel({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        Generating predictive insights…
      </div>
    );
  }

  const {
    revenuePrediction,
    monthlyTrend,
    festivalDemand = [],
    productForecast = [],
    churnProbability,
  } = data;

  const summaryCards = useMemo(
    () => [
      {
        label: "Next Period Revenue",
        value: `₹${revenuePrediction.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`,
        accent: "border-blue-100 bg-blue-50 text-blue-700",
      },
      {
        label: "Active Trend Points",
        value: monthlyTrend.length,
        accent: "border-emerald-100 bg-emerald-50 text-emerald-700",
      },
      {
        label: "Churn Probability",
        value: `${churnProbability.toFixed(1)}%`,
        accent: "border-rose-100 bg-rose-50 text-rose-700",
      },
    ],
    [churnProbability, monthlyTrend.length, revenuePrediction]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Predictive Analytics
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Rule-based + trend projections using linear regression over historical sales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-lg border p-4 ${card.accent}`}>
            <div className="text-xs uppercase tracking-wide font-semibold opacity-80">
              {card.label}
            </div>
            <div className="text-2xl font-semibold mt-2">{card.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-2">
          Festival Demand Outlook
        </h4>
        <div className="space-y-2">
          {festivalDemand.map((festival) => (
            <div
              key={festival.festival}
              className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg px-4 py-3"
            >
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {festival.festival}
                </div>
                <div className="text-xs text-gray-500">
                  Expected demand {festival.expectedDemand} units
                </div>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-emerald-600 font-semibold">
                Revenue ₹{festival.expectedRevenue.toLocaleString()}
              </div>
            </div>
          ))}
          {festivalDemand.length === 0 && (
            <div className="text-sm text-gray-500">
              No festival data available for the selected range.
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-2">
          Product Forecast (Top 10)
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wide">
                  Product
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  Units
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {productForecast.map((item) => (
                <tr key={item.product}>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    {item.projectedUnits.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    ₹{item.projectedRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
              {productForecast.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-3 text-center text-sm text-gray-500"
                  >
                    Upload sales data to generate forecasts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PredictionPanel);
"use client";

export default function PredictionPanel({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        Generating predictive insights…
      </div>
    );
  }

  const {
    revenuePrediction,
    monthlyTrend,
    festivalDemand,
    productForecast,
    churnProbability,
  } = data;

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Predictive Analytics
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Rule-based + trend projections using linear regression over historical sales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
            Next Period Revenue
          </div>
          <div className="text-2xl font-semibold text-blue-700 mt-2">
            ₹{revenuePrediction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
            Active Trend Points
          </div>
          <div className="text-2xl font-semibold text-emerald-700 mt-2">
            {monthlyTrend.length}
          </div>
        </div>
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
          <div className="text-xs uppercase tracking-wide text-rose-600 font-semibold">
            Churn Probability
          </div>
          <div className="text-2xl font-semibold text-rose-700 mt-2">
            {churnProbability.toFixed(1)}%
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-2">
          Festival Demand Outlook
        </h4>
        <div className="space-y-2">
          {festivalDemand.map((festival) => (
            <div
              key={festival.festival}
              className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg px-4 py-3"
            >
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {festival.festival}
                </div>
                <div className="text-xs text-gray-500">
                  Expected demand {festival.expectedDemand} units
                </div>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-emerald-600 font-semibold">
                Revenue ₹{festival.expectedRevenue.toLocaleString()}
              </div>
            </div>
          ))}
          {festivalDemand.length === 0 && (
            <div className="text-sm text-gray-500">
              No festival data available for the selected range.
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-2">
          Product Forecast (Top 10)
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wide">
                  Product
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  Units
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {productForecast.map((item) => (
                <tr key={item.product}>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    {item.projectedUnits.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    ₹{item.projectedRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
              {productForecast.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-3 text-center text-sm text-gray-500"
                  >
                    Upload sales data to generate forecasts.
                  </td>
                </tr>
      )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
