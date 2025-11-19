"use client";
import React, { useMemo } from "react";

function MarketingAnalytics({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        Loading marketing analytics…
      </div>
    );
  }

  const { summary, channels, campaigns } = data;
  const channelRows = useMemo(() => channels ?? [], [channels]);
  const campaignRows = useMemo(() => campaigns ?? [], [campaigns]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Total Spend",
        value: `₹${summary.totalSpend.toLocaleString()}`,
        accent: "border-blue-100 bg-blue-50 text-blue-700",
      },
      {
        label: "Revenue Influenced",
        value: `₹${summary.totalRevenue.toLocaleString()}`,
        accent: "border-emerald-100 bg-emerald-50 text-emerald-700",
      },
      {
        label: "Average CAC",
        value: `₹${summary.cac.toLocaleString()}`,
        accent: "border-purple-100 bg-purple-50 text-purple-700",
      },
      {
        label: "Marketing ROI",
        value: `${(summary.marketingRoi * 100).toFixed(1)}%`,
        accent: "border-amber-100 bg-amber-50 text-amber-700",
      },
    ],
    [summary]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Marketing ROI Analytics
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Channel efficiency and campaign profitability derived from sales performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <h4 className="text-md font-semibold text-gray-900 mb-3">
          Channel Performance
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wide">
                  Channel
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  Category
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  Spend
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  Revenue
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  CAC
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 uppercase tracking-wide">
                  ROI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {channelRows.map((channel) => (
                <tr key={`${channel.channel}-${channel.category}`}>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {channel.channel}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">
                    {channel.category}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    ₹{channel.spend.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    ₹{channel.revenue.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    ₹{channel.cac.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`font-semibold ${
                        channel.roi >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {channel.roi.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">
          Campaign Leaderboard
        </h4>
        <div className="space-y-3">
          {campaignRows.map((campaign) => (
            <div
              key={campaign.campaign}
              className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg px-4 py-3"
            >
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {campaign.campaign}
                </div>
                <div className="text-xs text-gray-500">
                  ROI: {campaign.roi.toFixed(1)}% • CAC ₹{campaign.cac.toLocaleString()}
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-6 text-sm">
                <span className="text-emerald-600 font-semibold">
                  Revenue ₹{campaign.revenue.toLocaleString()}
                </span>
                <span className="text-blue-600">
                  Spend ₹{campaign.spend.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          {campaignRows.length === 0 && (
            <div className="text-sm text-gray-500">
              No campaign level insights available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(MarketingAnalytics);
