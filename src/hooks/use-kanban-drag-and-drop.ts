import { useState } from 'react';
import type { DragEvent } from 'react';

export function useKanbanDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = (taskId: string) => {
    setIsDragging(true);
  };

  const dragEnd = () => {
    setIsDragging(false);
  };

  const dragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return {
    isDragging,
    dragStart,
    dragEnd,
    dragOver,
  };
}