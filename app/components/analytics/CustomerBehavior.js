"use client";
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_COLORS = [
  "rgba(59, 130, 246, 0.8)",
  "rgba(16, 185, 129, 0.8)",
  "rgba(249, 115, 22, 0.8)",
  "rgba(244, 63, 94, 0.8)",
];

function CustomerBehavior({ data }) {
  const safeData = data ?? null;
  const behavior = safeData?.behavior ?? {
    sessionDuration: 0,
    pageViews: 0,
    bounceRate: 0,
    returnRate: 0,
  };
  const frequency = safeData?.frequency ?? 0;
  const cartAbandonment = safeData?.cartAbandonment ?? 0;
  const lifetimeValue = safeData?.lifetimeValue ?? 0;
  const returnRate = safeData?.returnRate ?? 0;

  const chartData = useMemo(
    () => ({
      labels: ["Session Duration", "Page Views", "Bounce Rate", "Return Rate"],
      datasets: [
        {
          data: [
            behavior.sessionDuration,
            behavior.pageViews * 30,
            behavior.bounceRate,
            behavior.returnRate,
          ],
          backgroundColor: BASE_COLORS,
          borderWidth: 2,
        },
      ],
    }),
    [behavior]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Customer Engagement Snapshot",
        },
      },
    }),
    []
  );

  if (!safeData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">Loading behavior data…</div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Purchase Frequency"
          value={`${frequency} orders/day`}
          accent="bg-blue-50 border-blue-100 text-blue-700"
        />
        <MetricCard
          label="Customer Lifetime Value"
          value={`₹${lifetimeValue.toLocaleString()}`}
          accent="bg-green-50 border-green-100 text-green-700"
        />
        <MetricCard
          label="Cart Abandonment"
          value={`${cartAbandonment}%`}
          accent="bg-orange-50 border-orange-100 text-orange-700"
        />
        <MetricCard
          label="Return Rate"
          value={`${returnRate}%`}
          accent="bg-purple-50 border-purple-100 text-purple-700"
        />
      </div>

      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <SmallMetric label="Avg Session" value={`${behavior.sessionDuration}s`} />
        <SmallMetric label="Avg Page Views" value={behavior.pageViews} />
        <SmallMetric label="Bounce Rate" value={`${behavior.bounceRate}%`} />
        <SmallMetric label="Return Rate" value={`${behavior.returnRate}%`} />
      </div>
    </div>
  );
}

export default React.memo(CustomerBehavior);

function MetricCard({ label, value, accent }) {
  return (
    <div className={`p-4 rounded-lg border ${accent}`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function SmallMetric({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
"use client";
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_COLORS = [
  "rgba(59, 130, 246, 0.8)",
  "rgba(16, 185, 129, 0.8)",
  "rgba(249, 115, 22, 0.8)",
  "rgba(244, 63, 94, 0.8)",
];

function CustomerBehavior({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">Loading behavior data…</div>
    );
  }

  const { behavior, frequency, cartAbandonment, lifetimeValue, returnRate } = data;

  const chartData = useMemo(
    () => ({
      labels: ["Session Duration", "Page Views", "Bounce Rate", "Return Rate"],
      datasets: [
        {
          data: [
            behavior.sessionDuration,
            behavior.pageViews * 30,
            behavior.bounceRate,
            behavior.returnRate,
          ],
          backgroundColor: BASE_COLORS,
          borderWidth: 2,
        },
      ],
    }),
    [behavior]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Customer Engagement Snapshot",
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Purchase Frequency"
          value={`${frequency} orders/day`}
          accent="bg-blue-50 border-blue-100 text-blue-700"
        />
        <MetricCard
          label="Customer Lifetime Value"
          value={`₹${lifetimeValue.toLocaleString()}`}
          accent="bg-green-50 border-green-100 text-green-700"
        />
        <MetricCard
          label="Cart Abandonment"
          value={`${cartAbandonment}%`}
          accent="bg-orange-50 border-orange-100 text-orange-700"
        />
        <MetricCard
          label="Return Rate"
          value={`${returnRate}%`}
          accent="bg-purple-50 border-purple-100 text-purple-700"
        />
      </div>

      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <SmallMetric label="Avg Session" value={`${behavior.sessionDuration}s`} />
        <SmallMetric label="Avg Page Views" value={behavior.pageViews} />
        <SmallMetric label="Bounce Rate" value={`${behavior.bounceRate}%`} />
        <SmallMetric label="Return Rate" value={`${behavior.returnRate}%`} />
      </div>
    </div>
  );
}

export default React.memo(CustomerBehavior);

function MetricCard({ label, value, accent }) {
  return (
    <div className={`p-4 rounded-lg border ${accent}`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function SmallMetric({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_COLORS = [
  "rgba(59, 130, 246, 0.8)",
  "rgba(16, 185, 129, 0.8)",
  "rgba(249, 115, 22, 0.8)",
  "rgba(244, 63, 94, 0.8)",
];

export default function CustomerBehavior({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">Loading behavior data…</div>
    );
  }

  const { behavior, frequency, cartAbandonment, lifetimeValue, returnRate } = data;

  const chartData = {
    labels: ["Session Duration", "Page Views", "Bounce Rate", "Return Rate"],
    datasets: [
      {
        data: [
          behavior.sessionDuration,
          behavior.pageViews * 30,
          behavior.bounceRate,
          behavior.returnRate,
        ],
        backgroundColor: BASE_COLORS,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Customer Engagement Snapshot",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <div className="text-sm text-blue-600 font-medium">Purchase Frequency</div>
          <div className="text-2xl font-semibold text-blue-700 mt-1">
            {frequency} orders/day
          </div>
        </div>

        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
          <div className="text-sm text-green-600 font-medium">Customer Lifetime Value</div>
          <div className="text-2xl font-semibold text-green-700 mt-1">
            ₹{lifetimeValue.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
          <div className="text-sm text-orange-600 font-medium">Cart Abandonment</div>
          <div className="text-2xl font-semibold text-orange-700 mt-1">
            {cartAbandonment}%
          </div>
        </div>

        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
          <div className="text-sm text-purple-600 font-medium">Return Rate</div>
          <div className="text-2xl font-semibold text-purple-700 mt-1">
            {returnRate}%
          </div>
        </div>
      </div>

      <div className="h-64">
      <Doughnut data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">
            {behavior.sessionDuration}s
          </div>
          <div className="text-gray-600">Avg Session</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">
            {behavior.pageViews}
          </div>
          <div className="text-gray-600">Avg Page Views</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">
            {behavior.bounceRate}%
          </div>
          <div className="text-gray-600">Bounce Rate</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">
            {behavior.returnRate}%
          </div>
          <div className="text-gray-600">Return Rate</div>
        </div>
      </div>
    </div>
  );
}