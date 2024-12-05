import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/types';
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
  let currentSource: DragSource | null = null;

  return dropTargetForElements({
    element,
    getData,
    onDrag: (args) => {
      const source = args.source as unknown as DragSource;
      currentSource = source;  // Store the source
      
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
      } else if (source.data.type === 'column') {
        // Add column drag handling
        element.dispatchEvent(new CustomEvent('updateInsertPosition', {
          bubbles: true,
          detail: { type: 'column', index: getData().index }
        }));
      }
    },
    onDragEnter: (args) => {
      const source = args.source as unknown as DragSource;
      currentSource = source;  // Store the source
      
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
      } else if (source.data.type === 'column') {
        element.dispatchEvent(new CustomEvent('updateInsertPosition', {
          bubbles: true,
          detail: { type: 'column', index: getData().index }
        }));
      }
      onDragEnter();
    },
    onDragLeave: () => {
      element.dispatchEvent(new CustomEvent('updateInsertPosition', {
        bubbles: true,
        detail: { type: currentSource?.data.type, index: null }
      }));
      onDragLeave();
      currentSource = null;  // Clear the source
    },
    onDropTargetChange: () => {
      element.dispatchEvent(new CustomEvent('updateInsertPosition', {
        bubbles: true,
        detail: { type: currentSource?.data.type, index: null }
      }));
      onDragLeave();
      currentSource = null;  // Clear the source
    }
  });
}

export function setupDragMonitor(
  board: KanbanBoard,
  onDrop: (newBoard: KanbanBoard) => void
) {
  let activeDropTarget: number | null = null;

  return monitorForElements({
    onDrag(args) {
      // Keep track of the current active drop target
      const event = args.location.current.dropTargets[0]?.data as { index: number } | undefined;
      if (event) {
        activeDropTarget = event.index;
      }
    },

    onDrop(args: BaseEventPayload<ElementDragType>) {
      const source = args.source as unknown as DragSource;
      const sourceData = source.data;
      
      // Only drop if we have an active target
      if (activeDropTarget === null) return;
      
      const newBoard = structuredClone(board);

      if (sourceData.type === 'column') {
        const columns = Array.from(newBoard.columns);
        const sourceIndex = sourceData.sourceIndex;
        
        // Don't do anything if dropping in same spot
        if (activeDropTarget === sourceIndex || activeDropTarget === sourceIndex + 1) return;
        
        // Remove column from source
        const [movedColumn] = columns.splice(sourceIndex, 1);
        
        // Calculate correct insert position
        const insertAt = activeDropTarget > sourceIndex ? activeDropTarget - 1 : activeDropTarget;
        
        // Insert at exact position where the opening is
        columns.splice(insertAt, 0, movedColumn);
        
        // Update positions
        columns.forEach((column, index) => {
          column.position = index;
        });

        newBoard.columns = columns;
        onDrop(newBoard);
      }
      // ... task handling ...
    },
  });
} 