import React from 'react';
import { useToolStore } from '../store/toolStore';
import { UsageChart } from '../components/dashboard/UsageChart';
import { CategoryOverview } from '../components/dashboard/CategoryOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';

export function Dashboard() {
  const usage = useToolStore((state) => state.usage);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track your productivity and tool usage
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UsageChart usage={usage} />
        <RecentActivity usage={usage} />
      </div>

      <div className="mt-8">
        <CategoryOverview />
      </div>
    </div>
  );
}