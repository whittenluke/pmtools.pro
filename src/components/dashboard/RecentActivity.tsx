import type { ToolUsage } from '../../types/tool';

interface RecentActivityProps {
  usage: ToolUsage[];
}

export function RecentActivity({ usage }: RecentActivityProps) {
  const recentUsage = [...usage]
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 bg-gray-800 rounded-lg p-4">
      {recentUsage.map((item) => (
        <div key={item.toolId} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">{item.toolId}</p>
            <p className="text-xs text-gray-400">
              {new Date(item.lastUsed).toLocaleDateString()} at{' '}
              {new Date(item.lastUsed).toLocaleTimeString()}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                         bg-green-900/20 text-green-300">
            Used {item.usageCount} times
          </span>
        </div>
      ))}
    </div>
  );
}