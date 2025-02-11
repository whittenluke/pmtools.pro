'use client';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProjectStore } from '@/stores/project';
import type { Task, TaskUpdate, TaskColumnValues, ColumnValue } from '@/types';
import { useCallback } from 'react';
import type { TaskColumnValue } from '@/types/database';

type TaskStatus = 'todo' | 'in_progress' | 'done';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, groupId: string, position: number) => void;
}

export function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
  const { updateTask } = useProjectStore();

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => {
      const columnValues = (task.column_values as TaskColumnValues) || {};
      return columnValues?.status?.value === status;
    });
  };

  const handleTaskUpdate = useCallback(async (taskId: string, update: Partial<Task>) => {
    const columnValues = update.column_values || {};
    const taskUpdate: TaskUpdate = {
      ...update,
      column_values: Object.fromEntries(
        Object.entries(columnValues).map(([key, value]) => [
          key,
          typeof value === 'object' ? value : { value, metadata: {} }
        ])
      )
    };
    
    await updateTask(taskId, taskUpdate);
  }, [updateTask]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const columnValues = (task.column_values as TaskColumnValues) || {};
    const currentStatus = columnValues.status || { value: '', metadata: {} };
    
    const update: TaskUpdate = {
      column_values: {
        ...columnValues,
        status: {
          value: newStatus,
          metadata: currentStatus.metadata || {}
        }
      }
    };
    
    await handleTaskUpdate(taskId, update);
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