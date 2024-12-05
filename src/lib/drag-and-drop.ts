import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { DragLocation, DropTargetRecord, BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/types';
import type { KanbanBoard } from '../types/kanban';

export type DragData = {
  type: 'task' | 'column';
  id: string;
  columnId?: string;
  sourceIndex: number;
};

interface DragSource {
  data: DragData;
}

interface DragLocationWithDropTargets extends DragLocation {
  current: {
    dropTargets: DropTargetRecord[];
  };
}

export function setupDraggable(element: HTMLElement, data: DragData) {
  return draggable({
    element,
    getInitialData: () => data,
    onDrag: () => {
      element.classList.add('dragging');
      element.dispatchEvent(new CustomEvent('dragStart', { 
        bubbles: true,
        detail: { id: data.id, type: data.type }
      }));
    },
    onDrop: () => {
      element.classList.remove('dragging');
      element.dispatchEvent(new CustomEvent('dragEnd', { 
        bubbles: true,
        detail: { id: data.id, type: data.type }
      }));
    },
  });
}

export function setupDropTarget(
  element: HTMLElement, 
  onDragEnter: () => void,
  onDragLeave: () => void,
  getData: () => { id: string; index: number }
) {
  return dropTargetForElements({
    element,
    getData,
    onDrag: (args) => {
      const source = args.source as unknown as DragSource;
      if (source.data.type === 'task') {
        const rect = element.getBoundingClientRect();
        const mouseY = args.location.current.input.clientY;

        // Calculate relative position within the task
        const relativeY = mouseY - rect.top;
        const height = rect.height;
        const index = getData().index;

        // Insert before if in the top half, after if in the bottom half
        const insertIndex = relativeY < height / 2 ? index : index + 1;

        element.dispatchEvent(new CustomEvent('updateInsertPosition', {
          bubbles: true,
          detail: { index: insertIndex }
        }));
      }
    },
    onDragEnter: (args) => {
      const source = args.source as unknown as DragSource;
      if (source.data.type === 'task') {
        const rect = element.getBoundingClientRect();
        const mouseY = args.location.current.input.clientY;

        // When first entering, calculate position
        const relativeY = mouseY - rect.top;
        const height = rect.height;
        const index = getData().index;

        const insertIndex = relativeY < height / 2 ? index : index + 1;

        element.dispatchEvent(new CustomEvent('updateInsertPosition', {
          bubbles: true,
          detail: { index: insertIndex }
        }));
      }
      onDragEnter();
    },
    onDragLeave: () => {
      element.dispatchEvent(new CustomEvent('updateInsertPosition', {
        bubbles: true,
        detail: { index: null }
      }));
      onDragLeave();
    },
    onDropTargetChange: () => {
      element.dispatchEvent(new CustomEvent('updateInsertPosition', {
        bubbles: true,
        detail: { index: null }
      }));
      onDragLeave();
    }
  });
}

export function setupDragMonitor(
  board: KanbanBoard,
  onDrop: (newBoard: KanbanBoard) => void
) {
  return monitorForElements({
    onDrop(args: BaseEventPayload<ElementDragType>) {
      const source = args.source as unknown as DragSource;
      const location = args.location as unknown as DragLocationWithDropTargets;
      
      const destination = location.current.dropTargets[0];
      if (!destination) return;

      const sourceData = source.data;
      const destinationData = destination.data as { id: string; index: number };

      const newBoard = structuredClone(board);

      if (sourceData.type === 'column') {
        // Handle column reordering
        const columns = Array.from(newBoard.columns);
        const [movedColumn] = columns.splice(sourceData.sourceIndex, 1);
        columns.splice(destinationData.index, 0, movedColumn);
        
        columns.forEach((column, index) => {
          column.position = index;
        });

        newBoard.columns = columns;

        document.dispatchEvent(new CustomEvent('dragComplete', {
          bubbles: true,
          detail: { type: 'column' }
        }));
      } else if (sourceData.type === 'task') {
        // Handle task reordering
        const sourceCol = newBoard.columns.find(col => col.id === sourceData.columnId);
        const destCol = newBoard.columns.find(col => col.id === destinationData.id);
        
        if (!sourceCol || !destCol) return;

        // Remove task from source column
        const [task] = sourceCol.tasks.splice(sourceData.sourceIndex, 1);

        // Add task to destination column at the calculated position
        destCol.tasks.splice(destinationData.index, 0, task);
        
        // Update task positions
        destCol.tasks.forEach((task, index) => {
          task.position = index;
        });

        document.dispatchEvent(new CustomEvent('dragComplete', {
          bubbles: true,
          detail: { type: 'task' }
        }));
      }

      onDrop(newBoard);
    },
  });
} 