'use client';

import { Draggable } from '@hello-pangea/dnd';
import type { Database } from '@/types/supabase';
import type { Task } from '@/types';
import { format } from 'date-fns';

interface KanbanCardProps {
  task: Task;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function KanbanCard({ task, onDragStart, onDragEnd }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move"
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-gray-500">{task.description}</p>
        )}
        {task.due_date && (
          <div className="text-xs text-gray-500">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}