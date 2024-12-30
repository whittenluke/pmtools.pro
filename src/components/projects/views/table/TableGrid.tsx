import type { ViewModel } from '@/types';
import type { Database } from '@/types/supabase';
import { TableCell } from './TableCell';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableGridProps {
  tasks: Task[];
  view: ViewModel;
}

export function TableGrid({ tasks, view }: TableGridProps) {
  return (
    <div className="w-full divide-y divide-gray-200">
      <div className="bg-gray-50 flex">
        {view.columns.map((column) => (
          <div 
            key={column.id} 
            className="px-4 py-2 text-sm font-medium text-gray-500"
            style={{ minWidth: column.width || 200 }}
          >
            {column.title}
          </div>
        ))}
      </div>
      <div className="bg-white divide-y divide-gray-200">
        {tasks.map((task) => (
          <div key={task.id} className="flex">
            {view.columns.map((column) => (
              <TableCell
                key={column.id}
                task={task}
                column={column}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}