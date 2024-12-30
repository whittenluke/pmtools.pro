import React from 'react';
import { useCalendar } from '@/providers/CalendarProvider';

export function CalendarGrid() {
  const { view } = useCalendar();

  return (
    <div className="flex-1 p-4">
      <div className="text-center text-gray-500">
        Calendar {view} view coming soon...
      </div>
    </div>
  );
}