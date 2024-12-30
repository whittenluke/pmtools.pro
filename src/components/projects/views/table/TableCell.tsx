import { useState } from 'react';
import type { ViewColumn } from '@/types';
import type { Database } from '@/types/supabase';
import { TextCell } from './cells/TextCell';
import { StatusCell } from './cells/StatusCell';
import { DateCell } from './cells/DateCell';
import { UserCell } from './cells/UserCell';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableCellProps {
  task: Task;
  column: ViewColumn;
}

export function TableCell({ task, column }: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getCellComponent = () => {
    switch (column.type) {
      case 'text':
        return <TextCell value={task[column.key]} onEdit={setIsEditing} />;
      case 'status':
        return <StatusCell value={task.status} />;
      case 'date':
        return <DateCell value={task[column.key] as string} />;
      case 'user':
        return <UserCell value={task.assignee_id} />;
      default:
        return <TextCell value={task[column.key]} onEdit={setIsEditing} />;
    }
  };

  return (
    <div className="min-w-[200px] px-4 py-2">
      {getCellComponent()}
    </div>
  );
}