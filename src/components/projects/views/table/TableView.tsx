'use client';

import { useState, useEffect } from 'react';
import { TableGrid } from './TableGrid';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import type { ProjectView, Task } from '@/types';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/stores/project';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TableViewProps {
  tasks: Task[];
  view: ProjectView;
}

interface TableConfig {
  tables: Array<{
    id: string;
    title: string;
    tasks: Task[];
  }>;
  [key: string]: any;
}

export function TableView({ tasks, view }: TableViewProps) {
  const [title, setTitle] = useState(view.title || "Main Table");
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localView, setLocalView] = useState<ProjectView & { config: TableConfig }>({
    ...view,
    config: {
      ...(view.config || {}),
      tables: view.config?.tables || []
    },
    columns: view.columns || []
  });
  const { updateView } = useProjectStore();

  // Update local view when prop changes
  useEffect(() => {
    setLocalView({
      ...view,
      config: {
        ...(view.config || {}),
        tables: view.config?.tables || []
      },
      columns: view.columns || []
    });
  }, [view]);

  // Update local view when tasks change
  useEffect(() => {
    setLocalView(prev => ({
      ...prev,
      config: {
        ...(prev.config || {}),
        tables: [{
          id: 'default',
          title: title,
          tasks: tasks
        }]
      }
    }));
  }, [tasks, title]);

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