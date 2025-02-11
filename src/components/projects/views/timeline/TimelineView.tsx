import { useProjectStore } from '@/stores/project';
import { TimelineGrid } from './TimelineGrid';

export function TimelineView() {
  const { tasks } = useProjectStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-max">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first task</p>
            </div>
          ) : (
            <TimelineGrid tasks={tasks} />
          )}
        </div>
      </div>
    </div>
  );
}