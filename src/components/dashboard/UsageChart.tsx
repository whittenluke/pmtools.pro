import React from 'react';
import { BarChart, Activity } from 'lucide-react';
import type { ToolUsage } from '../../types/tool';

interface UsageChartProps {
  usage: ToolUsage[];
}

export function UsageChart({ usage }: UsageChartProps) {
  const sortedUsage = [...usage].sort((a, b) => b.usageCount - a.usageCount);
  const maxUsage = Math.max(...usage.map(u => u.usageCount));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Usage Analytics</h3>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {sortedUsage.map((item) => (
          <div key={item.toolId} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">{item.toolId}</span>
              <span className="text-sm text-gray-500">{item.usageCount} uses</span>
            </div>
            <div className="overflow-hidden h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-indigo-600 rounded"
                style={{ width: `${(item.usageCount / maxUsage) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}