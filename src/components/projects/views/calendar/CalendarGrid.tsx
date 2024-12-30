'use client';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { useCalendar } from './CalendarProvider';
import { useProjectStore } from '@/stores/project';

export function CalendarGrid() {
  const { currentDate } = useCalendar();
  const { tasks } = useProjectStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 p-px">
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className={`min-h-[100px] bg-white p-2 ${
            !isSameMonth(day, currentDate) ? 'text-gray-400' : ''
          }`}
        >
          <div className="font-medium">{format(day, 'd')}</div>
          <div className="mt-1 space-y-1">
            {tasks
              .filter((task) => task.due_date && format(new Date(task.due_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
              .map((task) => (
                <div
                  key={task.id}
                  className="text-xs p-1 bg-blue-50 text-blue-700 rounded truncate"
                >
                  {task.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}