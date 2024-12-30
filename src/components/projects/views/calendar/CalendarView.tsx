'use client';

import { CalendarProvider } from '@/providers/CalendarProvider';
import { CalendarToolbar } from './CalendarToolbar';
import { CalendarGrid } from './CalendarGrid';

export default function CalendarView() {
  return (
    <CalendarProvider>
      <div className="flex flex-col h-full">
        <CalendarToolbar />
        <CalendarGrid />
      </div>
    </CalendarProvider>
  );
}