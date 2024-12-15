import { useMemo } from 'react';
import { differenceInDays, isWithinInterval } from 'date-fns';
import type { Task } from '@/types';

interface TimelineBarProps {
  task: Task;
  columnWidth: number;
  visibleDates: Date[];
}

export function TimelineBar({ task, columnWidth, visibleDates }: TimelineBarProps) {
  const { position, width } = useMemo(() => {
    if (!task.start_date || !task.due_date) return { position: 0, width: 0 };

    const startDate = new Date(task.start_date);
    const dueDate = new Date(task.due_date);
    const firstVisibleDate = visibleDates[0];
    const lastVisibleDate = visibleDates[visibleDates.length - 1];

    // Check if task is within visible range
    if (!isWithinInterval(startDate, { start: firstVisibleDate, end: lastVisibleDate }) &&
        !isWithinInterval(dueDate, { start: firstVisibleDate, end: lastVisibleDate })) {
      return { position: 0, width: 0 };
    }

    const position = differenceInDays(startDate, firstVisibleDate) * columnWidth;
    const width = differenceInDays(dueDate, startDate) * columnWidth;

    return { position, width };
  }, [task, columnWidth, visibleDates]);

  if (width === 0) return null;

  return (
    <div
      className="absolute h-6 rounded-full bg-blue-500 opacity-90 hover:opacity-100 cursor-pointer"
      style={{
        left: `${position}px`,
        width: `${width}px`,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      <div className="px-2 text-xs text-white truncate">
        {task.title}
      </div>
    </div>
  );
}