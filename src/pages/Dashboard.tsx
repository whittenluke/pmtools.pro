import { useToolStore } from '../store/toolStore';
import { UsageChart } from '../components/dashboard/UsageChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';

export function Dashboard() {
  const usage = useToolStore((state) => state.usage);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Track your productivity and tool usage</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Usage Analytics</h2>
          <UsageChart usage={usage} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
          <RecentActivity usage={usage} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tool Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calculation</h3>
            <p className="text-gray-600 dark:text-gray-400">Tools for numerical analysis and computations</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Time Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Track and optimize your time usage</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Planning</h3>
            <p className="text-gray-600 dark:text-gray-400">Plan and organize projects effectively</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Documentation</h3>
            <p className="text-gray-600 dark:text-gray-400">Create and manage documentation</p>
          </div>
        </div>
      </div>
    </div>
  );
}