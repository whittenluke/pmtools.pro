'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useProjectStore } from '@/stores/project';

type ViewType = 'table' | 'kanban' | 'timeline' | 'calendar';

interface ViewContextType {
  currentView: ViewType | null;
  setView: (view: ViewType) => void;
  projectId: string;
}

const ViewContext = createContext<ViewContextType | null>(null);

export function ViewProvider({ children, projectId }: { children: React.ReactNode; projectId: string }) {
  const [currentView, setCurrentView] = useState<ViewType | null>(null);
  const { views } = useProjectStore();

  // Set initial view when views are loaded
  useEffect(() => {
    if (views.length > 0) {
      // Find default view or use first view
      const defaultView = views.find(v => v.is_default) || views[0];
      setCurrentView(defaultView.type as ViewType);
    }
  }, [views]);

  return (
    <ViewContext.Provider value={{ 
      currentView, 
      setView: (view) => setCurrentView(view), 
      projectId 
    }}>
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