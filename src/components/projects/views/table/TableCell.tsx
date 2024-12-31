import { useState } from 'react';
import type { ViewColumn } from '@/types';
import type { Database } from '@/types/supabase';
import { TextCell } from './cells/TextCell';
import { StatusCell } from './cells/StatusCell';
import { DateCell } from './cells/DateCell';
import { UserCell } from './cells/UserCell';
import { useProjectStore } from '@/stores/project';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableCellProps {
  task: Task;
  column: ViewColumn;
}

export function TableCell({ task, column }: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask } = useProjectStore();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask(task.id, { status_id: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAssigneeChange = async (userId: string) => {
    try {
      await updateTask(task.id, { assignee_id: userId });
    } catch (error) {
      console.error('Failed to update assignee:', error);
    }
  };

  const handleDateChange = async (date: Date | null) => {
    try {
      const isoDate = date?.toISOString() || null;
      await updateTask(task.id, { due_date: isoDate });
    } catch (error) {
      console.error('Failed to update due date:', error);
    }
  };

  const handleTextChange = async (text: string) => {
    try {
      await updateTask(task.id, { title: text });
    } catch (error) {
      console.error('Failed to update text:', error);
    }
  };

  const getCellComponent = () => {
    switch (column.type) {
      case 'text':
        return (
          <TextCell 
            value={task.title} 
            onEdit={setIsEditing}
            onChange={handleTextChange}
          />
        );
      case 'status':
        return (
          <StatusCell 
            value={task.status_id} 
            onChange={handleStatusChange}
          />
        );
      case 'date':
        return (
          <DateCell 
            value={task.due_date} 
            onChange={handleDateChange}
          />
        );
      case 'user':
        return (
          <UserCell 
            value={task.assignee_id} 
            onChange={handleAssigneeChange}
          />
        );
      default:
        return (
          <TextCell 
            value={task.title} 
            onEdit={setIsEditing}
            onChange={handleTextChange}
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