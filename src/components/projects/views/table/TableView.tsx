'use client';

import { TableGrid } from './TableGrid';
import type { ProjectView, ViewModel, Task, TaskColumnValues } from '@/types';

interface TableViewProps {
  tasks: Task[];
  view: ProjectView;
}

export function TableView({ tasks, view }: TableViewProps) {
  // Transform ProjectView to ViewModel ensuring all required properties
  const viewModel: ViewModel = {
    ...view,
    config: {
      ...view.config,
      status_config: view.status_config || {
        statuses: [],
        defaultStatusId: 'not_started'
      },
      tables: view.config?.tables || []
    },
    columns: view.columns || [],
    type: view.type || 'table',
    id: view.id,
    project_id: view.project_id,
    title: view.title,
    is_default: view.is_default || false,
    created_at: view.created_at,
    updated_at: view.updated_at,
    status_config: view.status_config || {
      statuses: [],
      defaultStatusId: 'not_started'
    }
  };

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
            <TableGrid tasks={tasks} view={viewModel} />
          )}
        </div>
      </div>
    </div>
  );
} 