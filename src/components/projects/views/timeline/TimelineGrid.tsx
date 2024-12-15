import { useProjectStore } from '@/stores/project';
import { useTimelineContext } from '@/hooks/use-timeline-context';
import { TimelineRow } from './TimelineRow';
import { TimelineBar } from './TimelineBar';

export function TimelineGrid() {
  const { tasks } = useProjectStore();
  const { visibleDates, columnWidth } = useTimelineContext();

  return (
    <div className="relative">
      {tasks.map((task) => (
        <TimelineRow key={task.id} task={task}>
          <TimelineBar
            task={task}
            columnWidth={columnWidth}
            visibleDates={visibleDates}
          />
        </TimelineRow>
      ))}
    </div>
  );
}