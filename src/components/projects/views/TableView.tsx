'use client';

import { useProjectStore } from '@/stores/project';
import { TableGrid } from './table/TableGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function TableView() {
  const { tasks, currentView } = useProjectStore();

  if (!currentView || currentView.type !== 'table') {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <TableGrid tasks={tasks || []} view={currentView} />
      </div>
    </div>
  );
} 