'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useProjectStore } from '@/stores/project';
import type { ProjectView } from '@/types';

interface ViewContextType {
  currentView: ProjectView | null;
  setView: (view: ProjectView) => void;
  projectId: string;
}

const ViewContext = createContext<ViewContextType | null>(null);

export function ViewProvider({ children, projectId }: { children: React.ReactNode; projectId: string }) {
  const { views, currentView, setCurrentView } = useProjectStore();

  // Set initial view when views are loaded
  useEffect(() => {
    if (views.length > 0 && !currentView) {
      // Find default view or use first view
      const defaultView = views.find(v => v.is_default) || views[0];
      setCurrentView(defaultView);
    }
  }, [views, currentView, setCurrentView]);

  return (
    <ViewContext.Provider value={{ 
      currentView, 
      setView: setCurrentView, 
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