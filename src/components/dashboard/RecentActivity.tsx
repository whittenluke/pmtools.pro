import type { ToolUsage } from '../../types/tool';

interface RecentActivityProps {
  usage: ToolUsage[];
}

export function RecentActivity({ usage }: RecentActivityProps) {
  const recentUsage = [...usage]
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {recentUsage.map((item) => (
        <div 
          key={item.toolId} 
          className="flex items-center justify-between p-3 rounded-lg 
                     bg-gray-50 dark:bg-gray-700/50"
        >
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {item.toolId}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(item.lastUsed).toLocaleDateString()} at{' '}
              {new Date(item.lastUsed).toLocaleTimeString()}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                         bg-indigo-100 dark:bg-indigo-900/30 
                         text-indigo-800 dark:text-indigo-300">
            Used {item.usageCount} times
          </span>
        </div>
      ))}

      {recentUsage.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No recent activity
        </p>
      )}
    </div>
  );
}