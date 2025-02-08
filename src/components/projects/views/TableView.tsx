'use client';

import { TableGrid } from './table/TableGrid';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import type { ProjectView, ViewModel, Task } from '@/types';
import type { Database } from '@/types/supabase';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/stores/project';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TableViewProps {
  tasks: Task[];
  view: ProjectView;
}

interface TableConfig {
  tables?: Array<{
    id: string;
    title: string;
    tasks: Task[];
  }>;
  [key: string]: any;
}

interface ViewWithConfig extends ProjectView {
  config: TableConfig;
}

export function TableView({ tasks, view }: TableViewProps) {
  const [title, setTitle] = useState(view.title || "Main Table");
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localView, setLocalView] = useState<ViewWithConfig>({
    ...view,
    config: {
      ...((view.config || {}) as TableConfig),
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
        ...((view.config || {}) as TableConfig),
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
        ...prev.config,
        tables: [{
          id: 'default',
          title: title,
          tasks: tasks
        }]
      }
    }));
  }, [tasks, title]);

  const handleTitleChange = async (newTitle: string) => {
    try {
      await updateView(view.id, { title: newTitle });
      setTitle(newTitle);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update table title:', error);
    }
  };

  const handleAddTable = async () => {
    try {
      const currentTables = localView.config.tables || [{
        id: 'default',
        title: title,
        tasks: tasks
      }];

      const updatedConfig = {
        ...localView.config,
        tables: [
          ...currentTables,
          {
            id: crypto.randomUUID(),
            title: "New Table",
            tasks: []
          }
        ]
      } as const;

      const updatedView: ViewWithConfig = {
        ...localView,
        config: updatedConfig
      };

      // Update UI immediately
      setLocalView(updatedView);

      // Then update the backend
      await updateView(view.id, {
        config: JSON.parse(JSON.stringify(updatedConfig))
      });
    } catch (error) {
      console.error('Failed to add new table:', error);
      // Revert on error
      setLocalView(view as ViewWithConfig);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      const currentTables = localView.config.tables || [];
      if (currentTables.length <= 1) return; // Prevent deleting last table

      const updatedConfig = {
        ...localView.config,
        tables: currentTables.filter(t => t.id !== tableId)
      } as const;

      const updatedView: ViewWithConfig = {
        ...localView,
        config: updatedConfig
      };

      // Update UI immediately
      setLocalView(updatedView);

      // Then update the backend
      await updateView(view.id, {
        config: JSON.parse(JSON.stringify(updatedConfig))
      });
    } catch (error) {
      console.error('Failed to delete table:', error);
      // Revert on error
      setLocalView(view as ViewWithConfig);
    }
  };

  const tables = localView.config?.tables || [{
    id: 'default',
    title: title,
    tasks: tasks
  }];

  if (localView.config?.tables && localView.config.tables.length === 0) {
    tables.push({
      id: 'default',
      title: title,
      tasks: tasks
    });
  }

  // Transform ProjectView to ViewModel ensuring all required properties
  const viewModel: ViewModel = {
    ...view,
    config: view.config || {},
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
      <div className="p-6 pl-16 space-y-12 overflow-x-auto">
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
          <>
            {tables.map((table) => (
              <div key={table.id} className="space-y-4 min-w-0">
                <div className="flex items-center space-x-3 group/header">
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronRight 
                      className={cn(
                        "h-5 w-5 transition-transform",
                        isCollapsed ? "" : "rotate-90"
                      )} 
                    />
                  </button>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center group">
                      {isEditing ? (
                        <Input
                          autoFocus
                          defaultValue={table.title}
                          className="h-8 px-2 w-[200px] text-lg font-semibold"
                          onBlur={(e) => handleTitleChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleTitleChange(e.currentTarget.value);
                            }
                          }}
                        />
                      ) : (
                        <div className="flex items-center">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-lg font-semibold hover:bg-muted/50 rounded px-2 py-1 -ml-2 transition-colors"
                          >
                            {table.title}
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTable(table.id)}
                                disabled={tables.length <= 1}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete table
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                    <span 
                      className={cn(
                        "text-sm text-muted-foreground transition-opacity",
                        isCollapsed ? "opacity-100" : "opacity-0 group-hover/header:opacity-100"
                      )}
                    >
                      {table.tasks.length} {table.tasks.length === 1 ? 'item' : 'items'}
                    </span>
                    {isCollapsed && (
                      <div className="flex items-center space-x-1">
                        {Object.entries(getStatusCounts(table.tasks)).map(([status, count]) => (
                          <div
                            key={status}
                            className="h-1.5 rounded-full bg-primary"
                            style={{
                              width: `${(count / table.tasks.length) * 100}px`,
                              backgroundColor: getStatusColor(status)
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {!isCollapsed && (
                  <TableGrid 
                    tasks={table.id === 'default' ? tasks : table.tasks} 
                    view={viewModel}
                  />
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddTable}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add new table
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function getStatusCounts(tasks: Task[]) {
  return tasks.reduce((acc, task) => {
    const status = (task.column_values as Record<string, any>)?.status?.value || 'not_started';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    completed: 'var(--success)',
    in_progress: 'var(--warning)',
    blocked: 'var(--destructive)',
    not_started: 'var(--muted)'
  };
  return statusColors[status] || 'var(--muted)';
} 