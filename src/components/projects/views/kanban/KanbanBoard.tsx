'use client';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProjectStore } from '@/stores/project';
import type { Database } from '@/types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskStatus = 'todo' | 'in_progress' | 'done';

export function KanbanBoard() {
  const { tasks, updateTask } = useProjectStore();

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => 
      (task.column_values as Record<string, any>)?.status?.value === status
    );
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    await updateTask(taskId, { 
      column_values: {
        ...(task.column_values as Record<string, any>),
        status: { value: newStatus }
      }
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-4">
        {(['todo', 'in_progress', 'done'] as const).map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-50 rounded-lg p-4"
              >
                <h3 className="font-semibold mb-4 capitalize">{status.replace('_', ' ')}</h3>
                <div className="space-y-2">
                  {getTasksByStatus(status).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded shadow"
                        >
                          <h4 className="font-medium">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}