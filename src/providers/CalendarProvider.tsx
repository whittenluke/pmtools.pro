import React, { createContext, useContext, ReactNode } from 'react';

interface CalendarContextType {
  view: 'month' | 'week' | 'day';
  setView: (view: 'month' | 'week' | 'day') => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [view, setView] = React.useState<'month' | 'week' | 'day'>('month');

  return (
    <CalendarContext.Provider value={{ view, setView }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
} 