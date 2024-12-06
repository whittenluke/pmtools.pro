import type { ToolUsage } from '../../types/tool';

interface UsageChartProps {
  usage: ToolUsage[];
}

export function UsageChart({ usage }: UsageChartProps) {
  const sortedUsage = [...usage].sort((a, b) => b.usageCount - a.usageCount);
  const maxUsage = Math.max(...usage.map(u => u.usageCount));

  return (
    <div className="space-y-4">
      {sortedUsage.map((item) => (
        <div key={item.toolId} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.toolId}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{item.usageCount} uses</span>
          </div>
          <div className="overflow-hidden h-2 bg-gray-200 dark:bg-gray-700 rounded">
            <div
              className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded"
              style={{ width: `${(item.usageCount / maxUsage) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}