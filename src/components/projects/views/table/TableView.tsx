'use client';

import { useState, useEffect } from 'react';
import { TableGrid } from './TableGrid';
import type { ProjectView, Task } from '@/types';

interface TableViewProps {
  tasks: Task[];
  view: ProjectView;
}

export function TableView({ tasks, view }: TableViewProps) {
  const [localView, setLocalView] = useState<ProjectView>(view);

  useEffect(() => {
    setLocalView(view);
  }, [view]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-max">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first task</p>
            </div>
          ) : (
            <TableGrid tasks={tasks} view={localView} />
          )}
        </div>
      </div>
    </div>
  );
} 