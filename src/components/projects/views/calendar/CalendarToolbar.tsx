'use client';

import React from 'react';
import { useCalendar } from '@/providers/CalendarProvider';

export function CalendarToolbar() {
  const { view, setView } = useCalendar();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setView('month')}
          className={`px-3 py-1 rounded ${
            view === 'month' ? 'bg-primary text-white' : 'hover:bg-gray-100'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setView('week')}
          className={`px-3 py-1 rounded ${
            view === 'week' ? 'bg-primary text-white' : 'hover:bg-gray-100'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setView('day')}
          className={`px-3 py-1 rounded ${
            view === 'day' ? 'bg-primary text-white' : 'hover:bg-gray-100'
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );
}