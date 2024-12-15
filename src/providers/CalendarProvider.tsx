'use client';

import { createContext, useContext, useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import type { CalendarState } from '@/types';

const CalendarContext = createContext<CalendarState | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        visibleDays: [], // TODO: Implement this based on the current view
        view,
        setCurrentDate,
        setView,
        nextMonth,
        prevMonth,
        nextWeek: () => {}, // TODO: Implement
        prevWeek: () => {}, // TODO: Implement
        nextDay: () => {}, // TODO: Implement
        prevDay: () => {}, // TODO: Implement
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
} 