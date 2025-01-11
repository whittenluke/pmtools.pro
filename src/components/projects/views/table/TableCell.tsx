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
    const update = { status_id: value };
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
      return <DateCell value={value} onChange={handleChange} />;
    case 'user':
      return <UserCell value={value} onChange={handleChange} />;
    case 'number':
      return <NumberCell value={value} onChange={handleChange} />;
    case 'text':
    default:
      return <TextCell value={value} onChange={handleChange} />;
  }
}