import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/types';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  tasks: Task[];
}

export function CalendarDay({ date, isCurrentMonth, tasks }: CalendarDayProps) {
  const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');

  return (
    <div className={`min-h-[120px] p-2 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : 
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}
        >
          {format(date, 'd')}
        </span>
      </div>
      <div className="mt-2 space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 truncate cursor-pointer hover:bg-blue-100"
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}