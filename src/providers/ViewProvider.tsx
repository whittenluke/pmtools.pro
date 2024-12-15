'use client';

import { createContext, useContext, useState } from 'react';

type ViewType = 'table' | 'kanban' | 'timeline' | 'calendar';

interface ViewContextType {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  projectId: string;
}

const ViewContext = createContext<ViewContextType | null>(null);

export function ViewProvider({ children, projectId }: { children: React.ReactNode; projectId: string }) {
  const [currentView, setView] = useState<ViewType>('table');

  return (
    <ViewContext.Provider value={{ currentView, setView, projectId }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}