import type { Task } from '@/types';

interface TimelineRowProps {
  task: Task;
  children: React.ReactNode;
}

export function TimelineRow({ task, children }: TimelineRowProps) {
  return (
    <div className="flex group hover:bg-gray-50">
      <div className="w-64 shrink-0 border-r border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-900">{task.title}</div>
        <div className="text-xs text-gray-500">{task.description}</div>
      </div>
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  );
}