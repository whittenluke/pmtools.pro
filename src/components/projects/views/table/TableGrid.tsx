import { useProjectStore } from '@/stores/project';
import { useTableColumns } from '@/hooks/use-table-columns';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

export function TableGrid() {
  const { tasks } = useProjectStore();
  const { columns } = useTableColumns();

  return (
    <div className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <TableRow key={task.id}>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              task={task}
              column={column}
            />
          ))}
        </TableRow>
      ))}
    </div>
  );
}