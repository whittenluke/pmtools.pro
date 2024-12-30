'use client';

import { useProjectStore } from '@/stores/project';
import { useView } from '@/providers/ViewProvider';
import { TableView } from './TableView';
import { KanbanView } from './kanban/KanbanView';
import { TimelineView } from './timeline/TimelineView';
import CalendarView from './calendar/CalendarView';

export function ProjectViews() {
  const { views } = useProjectStore();
  const { currentView } = useView();

  if (!currentView) return null;

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