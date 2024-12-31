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
    <div className="w-full divide-y divide-border">
      <div className="bg-muted/50 flex">
        {view.columns?.map((column) => (
          <div 
            key={column.id} 
            className="px-4 py-2 text-sm font-medium text-muted-foreground flex-shrink-0"
            style={{ width: column.width || 200 }}
          >
            {column.title}
          </div>
        ))}
      </div>
      <div className="bg-background divide-y divide-border">
        {tasks.map((task) => (
          <div key={task.id} className="flex hover:bg-muted/50 cursor-pointer">
            {view.columns?.map((column) => (
              <div 
                key={column.id}
                className="flex-shrink-0"
                style={{ width: column.width || 200 }}
              >
                <TableCell
                  task={task}
                  column={column}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}