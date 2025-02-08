'use client';

import { TableGrid } from './table/TableGrid';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import type { ProjectView } from '@/types';
import type { Database } from '@/types/supabase';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/stores/project';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableViewProps {
  tasks: Task[];
  view: ProjectView;
}

export function TableView({ tasks, view }: TableViewProps) {
  const [title, setTitle] = useState(view.title || "Main Table");
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localView, setLocalView] = useState(view);
  const { updateView } = useProjectStore();

  // Update local view when prop changes
  useEffect(() => {
    setLocalView(view);
  }, [view]);

  // Update local view when tasks change
  useEffect(() => {
    if (!localView.config?.tables) {
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
    } else {
      // Update tasks in the default table
      setLocalView(prev => ({
        ...prev,
        config: {
          ...prev.config,
          tables: prev.config.tables.map(table => 
            table.id === 'default' ? { ...table, tasks } : table
          )
        }
      }));
    }
  }, [tasks]);

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
      const currentTables = localView.config?.tables || [{
        id: 'default',
        title: title,
        tasks: tasks
      }];

      const updatedView = {
        ...localView,
        config: {
          ...localView.config,
          tables: [
            ...currentTables,
            {
              id: crypto.randomUUID(),
              title: "New Table",
              tasks: []
            }
          ]
        }
      };

      // Update UI immediately
      setLocalView(updatedView);

      // Then update the backend
      await updateView(view.id, {
        config: updatedView.config
      });
    } catch (error) {
      console.error('Failed to add new table:', error);
      // Revert on error
      setLocalView(view);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      const currentTables = localView.config?.tables || [];
      if (currentTables.length <= 1) return; // Prevent deleting last table

      const updatedView = {
        ...localView,
        config: {
          ...localView.config,
          tables: currentTables.filter(t => t.id !== tableId)
        }
      };

      // Update UI immediately
      setLocalView(updatedView);

      // Then update the backend
      await updateView(view.id, {
        config: updatedView.config
      });
    } catch (error) {
      console.error('Failed to delete table:', error);
      // Revert on error
      setLocalView(view);
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
                    view={view} 
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
    const status = task.status || 'not_started';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'var(--success)';
    case 'in_progress':
      return 'var(--warning)';
    case 'blocked':
      return 'var(--destructive)';
    default:
      return 'var(--muted)';
  }
} 