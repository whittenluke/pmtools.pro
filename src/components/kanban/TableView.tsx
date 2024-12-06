import type { KanbanBoard, KanbanTask } from '../../types/kanban';
import { useState } from 'react';
import { TaskDetailsModal } from './TaskDetailsModal';

interface TableViewProps {
  board: KanbanBoard;
  setBoard: (board: KanbanBoard) => void;
}

export function TableView({ board, setBoard }: TableViewProps) {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const allTasks = board.columns.flatMap(col => 
    col.tasks.map(task => ({
      ...task,
      columnTitle: col.title
    }))
  );

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allTasks.map(task => (
                    <tr 
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {task.columnTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {task.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                                       text-gray-600 dark:text-gray-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(updatedTask: KanbanTask) => {
          const column = board.columns.find(col => col.id === updatedTask.columnId);
          if (column) {
            setBoard({
              ...board,
              columns: board.columns.map(col =>
                col.id === column.id ? {
                  ...col,
                  tasks: col.tasks.map(t =>
                    t.id === updatedTask.id ? updatedTask : t
                  )
                } : col
              )
            });
          }
        }}
        onDelete={(task) => {
          setSelectedTask(null);
          const column = board.columns.find(col => col.id === task.columnId);
          if (column) {
            setBoard({
              ...board,
              columns: board.columns.map(col =>
                col.id === column.id ? {
                  ...col,
                  tasks: col.tasks.filter(t => t.id !== task.id)
                } : col
              )
            });
          }
        }}
      />
    </>
  );
} 