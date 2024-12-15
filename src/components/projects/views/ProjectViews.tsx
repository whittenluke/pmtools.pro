'use client';

import { useView } from '@/providers/ViewProvider';
import { TableView } from './TableView';
import { KanbanView } from './KanbanView';
import { TimelineView } from './TimelineView';
import { CalendarView } from './CalendarView';

export function ProjectViews() {
  const { currentView } = useView();

  switch (currentView) {
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