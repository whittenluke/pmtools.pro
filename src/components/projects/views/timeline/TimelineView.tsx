import { useProjectStore } from '@/stores/project';
import { TimelineHeader } from './TimelineHeader';
import { TimelineGrid } from './TimelineGrid';
import { TimelineToolbar } from './TimelineToolbar';

export function TimelineView() {
  const { currentProject } = useProjectStore();

  if (!currentProject) return null;

  return (
    <div className="h-full flex flex-col">
      <TimelineToolbar />
      <div className="flex-1 overflow-auto">
        <TimelineHeader />
        <TimelineGrid />
      </div>
    </div>
  );
}