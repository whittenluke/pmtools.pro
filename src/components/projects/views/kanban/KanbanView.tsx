import { useProjectStore } from '@/stores/project';
import { KanbanBoard } from './KanbanBoard';
import { KanbanToolbar } from './KanbanToolbar';

export function KanbanView() {
  const { currentProject } = useProjectStore();

  if (!currentProject) return null;

  return (
    <div className="h-full flex flex-col">
      <KanbanToolbar />
      <div className="flex-1 overflow-x-auto">
        <KanbanBoard />
      </div>
    </div>
  );
}