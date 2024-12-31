'use client';

import { TableGrid } from './table/TableGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { ProjectView } from '@/types';
import type { Database } from '@/types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableViewProps {
  tasks: Task[];
  view: ProjectView;
}

export function TableView({ tasks, view }: TableViewProps) {
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
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first task</p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        ) : (
          <TableGrid tasks={tasks} view={view} />
        )}
      </div>
    </div>
  );
} 