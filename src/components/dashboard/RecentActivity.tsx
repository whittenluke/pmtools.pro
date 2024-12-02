import React from 'react';
import { Clock } from 'lucide-react';
import type { ToolUsage } from '../../types/tool';

interface RecentActivityProps {
  usage: ToolUsage[];
}

export function RecentActivity({ usage }: RecentActivityProps) {
  const recentUsage = [...usage]
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {recentUsage.map((item) => (
          <div key={item.toolId} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.toolId}</p>
              <p className="text-xs text-gray-500">
                {new Date(item.lastUsed).toLocaleDateString()} at{' '}
                {new Date(item.lastUsed).toLocaleTimeString()}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Used {item.usageCount} times
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}