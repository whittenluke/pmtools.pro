'use client';

import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeft';
import { ChevronRightIcon } from '@/components/icons/ChevronRight';
import { useCalendar } from './CalendarProvider';

export function CalendarToolbar() {
  const { currentDate, setCurrentDate } = useCalendar();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </span>
      </div>
      <Button
        variant="outline"
        onClick={() => setCurrentDate(new Date())}
      >
        Today
      </Button>
    </div>
  );
}