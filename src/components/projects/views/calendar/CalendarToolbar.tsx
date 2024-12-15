'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { useCalendar } from '@/providers/CalendarProvider';

export function CalendarToolbar() {
  const { currentDate, view, setView, nextMonth, prevMonth } = useCalendar();

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('month')}
        >
          Month
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('week')}
        >
          Week
        </Button>
        <Button
          variant={view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('day')}
        >
          Day
        </Button>
      </div>
    </div>
  );
}