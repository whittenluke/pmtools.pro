'use client';

import { useState, useMemo } from 'react';
import { useProjectStore } from '@/stores/project';
import { supabase } from '@/lib/supabase';
import { StatusCell } from './cells/StatusCell';
import { DateCell } from './cells/DateCell';
import { PeopleCell } from './cells/PeopleCell';
import { TextCell } from './cells/TextCell';
import { NumberCell } from './cells/NumberCell';
import type { ViewColumn, StatusConfig } from '@/types';
import type { Database } from '@/types/supabase';
import { cn } from '@/lib/utils';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableCellProps {
  task: Task;
  column: ViewColumn;
  type?: string;
  value?: any;
  statusConfig?: StatusConfig;
  onStatusConfigChange?: (config: StatusConfig) => void;
}

export function TableCell({
  task,
  column,
  type = column.type,
  value = task[column.id as keyof Task],
  statusConfig,
  onStatusConfigChange,
}: TableCellProps) {
  const { optimisticUpdateTask, revertTaskUpdate, currentProject } = useProjectStore();
  const isTitle = column.id === 'title';

  const handleChange = async (value: any) => {
    const columnValues = task.column_values as { [key: string]: any };
    let update: Database['public']['Tables']['tasks']['Update'] = {
      column_values: {
        ...columnValues,
        [column.id]: value
      }
    };

    if (type === 'status') {
      update = {
        column_values: {
          ...columnValues,
          status: { value }
        }
      };
    }

    optimisticUpdateTask(task.id, update);

    try {
      const { error } = await supabase
        .from('tasks')
        .update(update)
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update task:', error);
      revertTaskUpdate(task.id);
    }
  };

  const getValue = () => {
    const columnValues = task.column_values as { [key: string]: any };
    if (type === 'status') {
      return columnValues?.status?.value || '';
    }
    return columnValues?.[column.id] || '';
  };
  
  const cellContent = useMemo(() => {
    switch (type) {
      case 'status':
        return (
          <div className={cn(
            "flex",
            isTitle ? "justify-start" : "justify-center"
          )}>
            <StatusCell
              value={getValue()}
              config={statusConfig}
              onConfigChange={onStatusConfigChange}
              onChange={handleChange}
            />
          </div>
        );
      case 'user':
      case 'person':
        return currentProject ? (
          <div className={cn(
            "flex",
            isTitle ? "justify-start" : "justify-center"
          )}>
            <PeopleCell 
              value={getValue()}
              row={task}
              workspaceId={currentProject.workspace_id}
              onUpdate={handleChange}
              allowMultiple={false}
            />
          </div>
        ) : null;
      case 'date':
        return (
          <div className={cn(
            "flex",
            isTitle ? "justify-start" : "justify-center"
          )}>
            <DateCell 
              value={getValue()} 
              onChange={handleChange}
            />
          </div>
        );
      case 'number':
        return (
          <div className={cn(
            "flex",
            isTitle ? "justify-start" : "justify-center"
          )}>
            <NumberCell 
              value={getValue()} 
              onChange={handleChange}
            />
          </div>
        );
      default:
        return (
          <div className={cn(
            "flex w-full h-full",
            isTitle ? "justify-start" : "justify-center"
          )}>
            <TextCell 
              value={getValue()} 
              onChange={handleChange}
            />
          </div>
        );
    }
  }, [type, task, column.id, statusConfig, onStatusConfigChange, isTitle, currentProject]);

  return cellContent;
}