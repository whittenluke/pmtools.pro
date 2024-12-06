import { useToolStore } from '../store/toolStore';
import { UsageChart } from '../components/dashboard/UsageChart';
import { CategoryOverview } from '../components/dashboard/CategoryOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Activity, Clock } from 'lucide-react';

export function Dashboard() {
  const usage = useToolStore((state) => state.usage);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Track your productivity and tool usage
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Usage Analytics</h3>
            <Activity className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <UsageChart usage={usage} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <RecentActivity usage={usage} />
        </div>
      </div>

      <div className="mt-8">
        <CategoryOverview />
      </div>
    </div>
  );
}