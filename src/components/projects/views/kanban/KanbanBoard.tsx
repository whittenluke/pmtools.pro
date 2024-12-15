'use client';

import { useProjectStore } from '@/stores/project';
import type { Task } from '@/types';

type TaskStatus = 'todo' | 'in_progress' | 'done';

export function KanbanBoard() {
  const { tasks, updateTask } = useProjectStore();

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {(['todo', 'in_progress', 'done'] as const).map((status) => (
        <div key={status} className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4 capitalize">{status.replace('_', ' ')}</h3>
          <div className="space-y-2">
            {getTasksByStatus(status).map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded shadow"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('taskId', task.id);
                }}
              >
                <h4 className="font-medium">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}