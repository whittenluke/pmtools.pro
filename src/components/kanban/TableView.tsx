import type { KanbanBoard } from '../../types/kanban';

interface TableViewProps {
  board: KanbanBoard;
  setBoard: (board: KanbanBoard) => void;
}

export function TableView({ board, setBoard: _setBoard }: TableViewProps) {
  const allTasks = board.columns.flatMap(col => 
    col.tasks.map(task => ({
      ...task,
      columnTitle: col.title
    }))
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allTasks.map(task => (
            <tr key={task.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{task.columnTitle}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{task.description}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 