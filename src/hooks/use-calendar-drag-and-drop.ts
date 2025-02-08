import { useState } from 'react';
import { useProjectStore } from '@/stores/project';
import type { Database } from '@/types/supabase';
import type { Task } from '@/types';
import { format } from 'date-fns';

export function useCalendarDragAndDrop() {
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const { updateTask } = useProjectStore();

  const handleDragStart = (task: Task) => {
    setDraggingTask(task);
  };

  const handleDragEnd = () => {
    setDraggingTask(null);
  };

  const handleDrop = async (date: Date) => {
    if (!draggingTask) return;

    await updateTask(draggingTask.id, {
      due_date: format(date, 'yyyy-MM-dd')
    });

    setDraggingTask(null);
  };

  return {
    draggingTask,
    handleDragStart,
    handleDragEnd,
    handleDrop
  };
}