'use client';

import { useProjectStore } from '@/stores/project';
import { TableGrid } from './table/TableGrid';

export function TableView() {
  const { tasks, currentView } = useProjectStore();

  if (!currentView || currentView.type !== 'table') {
    return null;
  }

  return (
    <div className="p-4">
      <TableGrid tasks={tasks} view={currentView} />
    </div>
  );
} 