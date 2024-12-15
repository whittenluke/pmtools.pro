import { createContext, useContext, useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';

interface CalendarContextType {
  currentDate: Date;
  viewMode: 'month' | 'week' | 'day';
  setViewMode: (mode: 'month' | 'week' | 'day') => void;
  nextMonth: () => void;
  prevMonth: () => void;
  visibleDays: Date[];
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const visibleDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <CalendarContext.Provider value={{
      currentDate,
      viewMode,
      setViewMode,
      nextMonth,
      prevMonth,
      visibleDays
    }}>
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