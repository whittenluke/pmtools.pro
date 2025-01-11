'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/project';
import { supabase } from '@/lib/supabase';
import { StatusCell } from './cells/StatusCell';
import { DateCell } from './cells/DateCell';
import { UserCell } from './cells/UserCell';
import { TextCell } from './cells/TextCell';
import { NumberCell } from './cells/NumberCell';
import type { ViewColumn, StatusConfig } from '@/types';
import type { Database } from '@/types/supabase';

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
  const { optimisticUpdateTask, revertTaskUpdate } = useProjectStore();

  const handleChange = async (value: any) => {
    let update: Partial<Task>;
    
    if (type === 'status') {
      update = { status_id: value };
    } else {
      // Store text values in the column_values JSONB field
      update = {
        column_values: {
          ...task.column_values,
          [column.id]: value
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
    if (type === 'status') {
      return task.status_id;
    }
    return task.column_values?.[column.id] || '';
  };

  switch (type) {
    case 'status':
      return (
        <StatusCell
          value={task.status_id}
          config={statusConfig}
          onConfigChange={onStatusConfigChange}
          onChange={handleChange}
        />
      );
    case 'date':
      return <DateCell value={getValue()} onChange={handleChange} />;
    case 'user':
      return <UserCell value={getValue()} onChange={handleChange} />;
    case 'number':
      return <NumberCell value={getValue()} onChange={handleChange} />;
    case 'text':
    default:
      return <TextCell value={getValue()} onChange={handleChange} />;
  }
}