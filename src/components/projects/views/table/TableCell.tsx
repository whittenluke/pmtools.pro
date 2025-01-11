import { useState } from 'react';
import type { ViewColumn } from '@/types';
import type { Database } from '@/types/supabase';
import { TextCell } from './cells/TextCell';
import { StatusCell } from './cells/StatusCell';
import { DateCell } from './cells/DateCell';
import { PeopleCell } from './cells/PeopleCell';
import { NumberCell } from './cells/NumberCell';
import { useProjectStore } from '@/stores/project';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableCellProps {
  task: Task;
  column: ViewColumn;
}

export function TableCell({ task, column }: TableCellProps) {
  // Local UI state only
  const [isEditing, setIsEditing] = useState(false);
  
  // Global state and actions
  const { updateTask, currentProject, optimisticUpdateTask } = useProjectStore();

  const handleUpdate = async (field: keyof Task, value: any) => {
    try {
      // Optimistic update
      optimisticUpdateTask(task.id, { [field]: value });
      
      // Actual update
      await updateTask(task.id, { [field]: value });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      // Store will handle reverting the optimistic update on failure
    }
  };

  const getCellComponent = () => {
    const columnKey = column.key || column.id;
    const value = task.column_values?.[columnKey] ?? null;

    switch (column.type) {
      case 'text':
        return (
          <TextCell 
            value={task.title} 
            onEdit={setIsEditing}
            onChange={(value) => handleUpdate('title', value)}
          />
        );
      case 'status':
        return (
          <StatusCell 
            value={task.status_id} 
            onChange={(value) => handleUpdate('status_id', value)}
          />
        );
      case 'date':
        return (
          <DateCell 
            value={task.due_date} 
            onChange={(value) => handleUpdate('due_date', value)}
          />
        );
      case 'user':
      case 'person':
      case 'people':
        return (
          <PeopleCell 
            value={task.assignee_id} 
            row={task}
            workspaceId={currentProject?.workspace_id || ''}
            onUpdate={(value) => handleUpdate('assignee_id', value?.[0] || null)}
            allowMultiple={column.type === 'people'}
          />
        );
      case 'number':
        return (
          <NumberCell
            value={value as number}
            onChange={(value) => handleUpdate(`column_values.${columnKey}`, value)}
            config={column.config}
          />
        );
      default:
        return (
          <TextCell 
            value={task.title} 
            onEdit={setIsEditing}
            onChange={(value) => handleUpdate('title', value)}
          />
        );
    }
  };

  return (
    <div className="px-4 py-2">
      {getCellComponent()}
    </div>
  );
}