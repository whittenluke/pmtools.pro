import { useTimelineContext } from '@/hooks/use-timeline-context';
import { format } from 'date-fns';

export function TimelineHeader() {
  const { visibleDates, columnWidth } = useTimelineContext();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex">
        <div className="w-64 shrink-0 border-r border-gray-200 p-4">
          <h3 className="font-medium text-gray-900">Tasks</h3>
        </div>
        <div className="flex-1">
          <div className="flex">
            {visibleDates.map((date) => (
              <div
                key={date.toISOString()}
                className="border-r border-gray-200 p-4 text-center"
                style={{ width: columnWidth }}
              >
                <div className="text-sm font-medium text-gray-900">
                  {format(date, 'MMM d')}
                </div>
                <div className="text-xs text-gray-500">
                  {format(date, 'EEEE')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}