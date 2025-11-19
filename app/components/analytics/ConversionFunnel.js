"use client";
import React, { useMemo } from "react";

function ConversionFunnel({ data, title }) {
  if (!data) return <div className="bg-white p-6 rounded-lg shadow">Loading funnel data...</div>;

  const funnelDetails = useMemo(() => {
    const overall = data[data.length - 1]?.percentage ?? 0;
    return {
      stages: data.map((stage, index) => {
        const previous = index > 0 ? data[index - 1] : null;
        const dropOff =
          previous && previous.count > 0
            ? (((previous.count - stage.count) / previous.count) * 100).toFixed(1)
            : null;

        return {
          key: stage.stage,
          label: stage.stage,
          percentage: stage.percentage ?? 0,
          count: stage.count,
          showDropOff: dropOff !== null,
          dropOff,
          isLast: index === data.length - 1,
        };
      }),
      overall,
    };
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title || 'Conversion Funnel'}</h3>
      <div className="space-y-4">
        {funnelDetails.stages.map((stage) => (
          <div key={stage.key} className="relative">
              <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{stage.label}</span>
                <span className="text-sm text-gray-600">{stage.percentage}%</span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div 
                    className={`h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    stage.isLast ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.count.toLocaleString()}
                  </div>
                </div>
                
              {!stage.isLast && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                  </div>
                )}
              </div>
              
            {stage.showDropOff && (
                <div className="absolute -top-1 right-4 text-xs text-red-500">
                -{stage.dropOff}%
                </div>
              )}
            </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {funnelDetails.overall}%
          </div>
          <div className="text-sm text-gray-600">Overall Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConversionFunnel);
