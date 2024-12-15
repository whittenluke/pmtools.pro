'use client';

import { useProjectStore } from '@/stores/project';
import { TableView } from './TableView';
import { KanbanView } from './KanbanView';
import { TimelineView } from './TimelineView';
import { CalendarView } from './CalendarView';

export function ProjectViews() {
  const { currentView } = useProjectStore();

  if (!currentView) return null;

  switch (currentView.type) {
    case 'table':
      return <TableView />;
    case 'kanban':
      return <KanbanView />;
    case 'timeline':
      return <TimelineView />;
    case 'calendar':
      return <CalendarView />;
    default:
      return <TableView />;
  }
}