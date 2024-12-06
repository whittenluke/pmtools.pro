import { Plus, X } from 'lucide-react';
import type { KanbanBoard, KanbanTask, KanbanColumn } from '../../types/kanban';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { useEffect, useRef, useState } from 'react';
import { TaskDetailsModal } from './TaskDetailsModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { setupDraggable, setupDropTarget, setupDragMonitor } from '../../lib/drag-and-drop';

interface KanbanViewProps {
  board: KanbanBoard;
  setBoard: (board: KanbanBoard) => void;
  addTask: (columnId: string) => void;
}

interface KanbanColumnProps {
  column: KanbanBoard['columns'][0];
  columnIndex: number;
  onTitleChange: (title: string) => void;
  onDeleteClick: () => void;
  onTaskClick: (task: KanbanTask) => void;
  onTaskDeleteClick: (taskId: string) => void;
  onAddTaskClick: () => void;
}

interface KanbanTaskProps {
  task: KanbanTask;
  taskIndex: number;
  columnId: string;
  onClick: () => void;
  onDeleteClick: () => void;
  isDragging: boolean;
}

function KanbanTask({
  task,
  taskIndex,
  columnId,
  onClick,
  onDeleteClick,
  isDragging,
}: KanbanTaskProps) {
  const taskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!taskRef.current) return;
    
    return setupDraggable(taskRef.current, {
      type: 'task',
      id: task.id,
      columnId,
      sourceIndex: taskIndex
    });
  }, [task.id, taskIndex, columnId]);

  return (
    <div
      ref={taskRef}
      onClick={onClick}
      className={`bg-white p-2 sm:p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group select-none z-40 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-30"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="pointer-events-none">
        <div className="text-sm sm:text-base font-medium truncate">
          {task.title || 'Untitled Task'}
        </div>
        <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 line-clamp-6 overflow-hidden">
          {task.description || 'Add description...'}
        </div>
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 sm:mt-2 max-h-[40px] overflow-hidden">
            {task.tags.map(tag => (
              <span
                key={tag}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  columnIndex,
  onTitleChange,
  onDeleteClick,
  onTaskClick,
  onTaskDeleteClick,
  onAddTaskClick,
}: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [insertTaskAtIndex, setInsertTaskAtIndex] = useState<number | null>(null);

  // Setup column draggable
  useEffect(() => {
    if (!columnRef.current) return;
    
    return setupDraggable(columnRef.current, {
      type: 'column',
      id: column.id,
      sourceIndex: columnIndex
    });
  }, [column.id, columnIndex]);

  // Handle task drag events
  useEffect(() => {
    const handleDragStart = (event: Event) => {
      const e = event as CustomEvent;
      if (e.detail.type === 'task') {
        setDraggingTaskId(e.detail.id);
      }
    };

    const handleDragEnd = () => {
      setDraggingTaskId(null);
      setInsertTaskAtIndex(null);
    };

    const handleUpdateInsertPosition = (event: Event) => {
      const e = event as CustomEvent;
      if (e.detail.type === 'task') {
        if (e.target && columnRef.current?.contains(e.target as Node)) {
          setInsertTaskAtIndex(e.detail.index);
        }
      }
    };

    const handleDragComplete = () => {
      setDraggingTaskId(null);
      setInsertTaskAtIndex(null);
    };

    document.addEventListener('dragStart', handleDragStart);
    document.addEventListener('dragEnd', handleDragEnd);
    document.addEventListener('updateInsertPosition', handleUpdateInsertPosition);
    document.addEventListener('dragComplete', handleDragComplete);

    return () => {
      document.removeEventListener('dragStart', handleDragStart);
      document.removeEventListener('dragEnd', handleDragEnd);
      document.removeEventListener('updateInsertPosition', handleUpdateInsertPosition);
      document.removeEventListener('dragComplete', handleDragComplete);
    };
  }, []);

  // Setup task drop targets
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // Top drop target
    const topElement = document.getElementById(`task-drop-${column.id}-top`);
    if (topElement) {
      const cleanup = setupDropTarget(
        topElement,
        () => setInsertTaskAtIndex(0),
        () => setInsertTaskAtIndex(null),
        () => ({ type: 'task', id: column.id, index: 0 })
      );
      cleanups.push(cleanup);
    }

    // Task drop targets
    column.tasks.forEach((task, index) => {
      const element = document.getElementById(`task-drop-${task.id}`);
      if (!element) return;

      const cleanup = setupDropTarget(
        element,
        () => setInsertTaskAtIndex(index + 1),
        () => setInsertTaskAtIndex(null),
        () => ({ type: 'task', id: column.id, index: index + 1 })
      );
      cleanups.push(cleanup);
    });

    // Bottom drop target
    const bottomElement = document.getElementById(`task-drop-${column.id}-empty`);
    if (bottomElement) {
      const cleanup = setupDropTarget(
        bottomElement,
        () => setInsertTaskAtIndex(column.tasks.length),
        () => setInsertTaskAtIndex(null),
        () => ({ type: 'task', id: column.id, index: column.tasks.length })
      );
      cleanups.push(cleanup);
    }

    return () => cleanups.forEach(cleanup => cleanup());
  }, [column.id, column.tasks.length]);

  const getTaskShift = (taskIndex: number) => {
    if (!draggingTaskId || insertTaskAtIndex === null) return 0;
    if (taskIndex >= insertTaskAtIndex) return 80;
    return 0;
  };

  return (
    <div
      ref={columnRef}
      className="bg-gray-50 rounded-lg p-4 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          id={`column-title-${column.id}`}
          name={`column-title-${column.id}`}
          value={column.title}
          onChange={(e) => onTitleChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-base sm:text-lg font-medium bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 w-full cursor-text"
          placeholder="Column Title"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
          className="text-gray-400 hover:text-red-500 ml-2 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 min-h-[50px] relative">
        {/* Top drop target for tasks */}
        <div 
          id={`task-drop-${column.id}-top`}
          className="h-6 -mt-5"
          ref={el => {
            if (!el) return;
            setupDropTarget(
              el,
              () => setInsertTaskAtIndex(0),
              () => setInsertTaskAtIndex(null),
              () => ({ type: 'task', id: column.id, index: 0 }),
              { canDrop: ({ source }) => source.data.type === 'task' }
            );
          }}
        />
        
        {column.tasks.map((task, taskIndex) => (
          <div 
            key={task.id} 
            id={`task-drop-${task.id}`}
            className="relative transition-transform duration-200"
            style={{ 
              transform: `translateY(${getTaskShift(taskIndex)}px)`,
            }}
          >
            <KanbanTask
              task={task}
              taskIndex={taskIndex}
              columnId={column.id}
              onClick={() => onTaskClick(task)}
              onDeleteClick={() => onTaskDeleteClick(task.id)}
              isDragging={task.id === draggingTaskId}
            />
          </div>
        ))}

        {/* Commenting out bottom task drop target
        <div 
          id={`task-drop-${column.id}-empty`}
          className="h-8"
        />
        */}
      </div>

      <button
        onClick={onAddTaskClick}
        className="w-full mt-3 sm:mt-4 p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded flex items-center justify-center gap-1 text-sm sm:text-base cursor-pointer"
      >
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
        Add Task
      </button>
    </div>
  );
}

export function KanbanView({ board, setBoard, addTask }: KanbanViewProps) {
  const { supabase } = useSupabase();
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'column' | 'task', id: string, columnId?: string } | null>(null);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const leftDropRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightDropRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [activeDropTarget, setActiveDropTarget] = useState<number | null>(null);

  // Setup drag monitor
  useEffect(() => {
    return setupDragMonitor(board, async (newBoard) => {
      setBoard(newBoard);

      // Persist column positions
      if (newBoard.columns.some((col, i) => col.position !== board.columns[i]?.position)) {
        try {
          const updates = newBoard.columns.map((column: KanbanColumn) => ({
            id: column.id,
            position: column.position,
            board_id: board.id
          }));

          await supabase
            .from('kanban_columns')
            .upsert(updates, { onConflict: 'id' });
        } catch (error) {
          console.error('Error updating column positions:', error);
        }
      }

      // Persist task positions
      const allTasks = newBoard.columns.flatMap((col: KanbanColumn) => col.tasks);
      const oldTasks = board.columns.flatMap((col: KanbanColumn) => col.tasks);
      
      if (allTasks.some((task, i) => 
        task.position !== oldTasks[i]?.position || 
        task.columnId !== oldTasks[i]?.columnId
      )) {
        try {
          const now = new Date().toISOString();
          const updates = allTasks.map((task: KanbanTask) => ({
            id: task.id,
            position: task.position,
            column_id: task.columnId,
            title: task.title,
            description: task.description,
            tags: task.tags,
            updated_at: now
          }));

          await supabase
            .from('kanban_tasks')
            .upsert(updates);
        } catch (error) {
          console.error('Error updating task positions:', error);
        }
      }
    });
  }, [board, setBoard, supabase]);

  // Setup drop targets
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    board.columns.forEach((_, index) => {
      const leftElement = leftDropRefs.current[index];
      const rightElement = rightDropRefs.current[index];

      if (leftElement) {
        const cleanup = setupDropTarget(
          leftElement,
          () => setActiveDropTarget(index),
          () => setActiveDropTarget(null),
          () => ({ type: 'column', id: 'column-drop', index }),
          { canDrop: ({ source }) => source.data.type === 'column' }
        );
        cleanups.push(cleanup);
      }

      if (rightElement) {
        const cleanup = setupDropTarget(
          rightElement,
          () => setActiveDropTarget(index + 1),
          () => setActiveDropTarget(null),
          () => ({ type: 'column', id: 'column-drop', index: index + 1 }),
          { canDrop: ({ source }) => source.data.type === 'column' }
        );
        cleanups.push(cleanup);
      }
    });

    return () => cleanups.forEach(cleanup => cleanup());
  }, [board.columns]);

  useEffect(() => {
    const handleDragStart = (event: Event) => {
      const e = event as CustomEvent;
      if (e.detail.type === 'column') {
        setIsDraggingColumn(true);
        setDraggingColumnId(e.detail.id);
      }
    };

    const handleDragEnd = () => {
      setIsDraggingColumn(false);
      setDraggingColumnId(null);
      setActiveDropTarget(null);
    };

    const handleUpdateInsertPosition = (event: Event) => {
      const e = event as CustomEvent;
      if (e.detail.type === 'column') {
        const newIndex = e.detail.index;
        if (newIndex !== null) {
          setActiveDropTarget(newIndex);
        }
      }
    };

    document.addEventListener('dragStart', handleDragStart);
    document.addEventListener('dragEnd', handleDragEnd);
    document.addEventListener('updateInsertPosition', handleUpdateInsertPosition);

    return () => {
      document.removeEventListener('dragStart', handleDragStart);
      document.removeEventListener('dragEnd', handleDragEnd);
      document.removeEventListener('updateInsertPosition', handleUpdateInsertPosition);
    };
  }, [board.columns, draggingColumnId, isDraggingColumn]);

  const deleteColumn = async (columnId: string) => {
    setBoard({
      ...board,
      columns: board.columns.filter((col: KanbanColumn) => col.id !== columnId)
    });

    try {
      await supabase
        .from('kanban_columns')
        .delete()
        .eq('id', columnId);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const updateTask = async (taskId: string, columnId: string, updates: Partial<KanbanTask>) => {
    setBoard({
      ...board,
      columns: board.columns.map((col: KanbanColumn) => 
        col.id === columnId ? {
          ...col,
          tasks: col.tasks.map((task: KanbanTask) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        } : col
      )
    });

    try {
      await supabase
        .from('kanban_tasks')
        .update({
          ...updates,
          updated_at: new Date()
        })
        .eq('id', taskId);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const updateColumnTitle = async (columnId: string, title: string) => {
    setBoard({
      ...board,
      columns: board.columns.map((col: KanbanColumn) =>
        col.id === columnId ? { ...col, title } : col
      )
    });

    try {
      await supabase
        .from('kanban_columns')
        .update({ title })
        .eq('id', columnId);
    } catch (error) {
      console.error('Error updating column title:', error);
    }
  };

  const deleteTask = async (taskId: string, columnId: string) => {
    setBoard({
      ...board,
      columns: board.columns.map((col: KanbanColumn) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t: KanbanTask) => t.id !== taskId) }
          : col
      )
    });

    try {
      await supabase
        .from('kanban_tasks')
        .delete()
        .eq('id', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getColumnShift = (columnIndex: number) => {
    if (!isDraggingColumn || !draggingColumnId || activeDropTarget === null) return 0;
    const draggedColumnIndex = board.columns.findIndex(col => col.id === draggingColumnId);
    
    // Don't move the dragged column
    if (columnIndex === draggedColumnIndex) return 0;
    
    // When initially picking up a column, no other columns should move
    if (activeDropTarget === draggedColumnIndex) return 0;
    
    // Create space between columns where we're trying to drop
    if (activeDropTarget === columnIndex) {
      // Don't move if this is the original adjacent column
      if (columnIndex === draggedColumnIndex + 1) return 0;
      return 40;
    }
    if (activeDropTarget - 1 === columnIndex) {
      // Don't move if this is the original adjacent column
      if (columnIndex === draggedColumnIndex - 1) return 0;
      return -40;
    }
    
    return 0;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 relative">
        {/* Commenting out leftmost drop target
        <div 
          id="column-drop-start"
          className="absolute left-0 top-0 bottom-0 w-36 -ml-16"
        />
        */}
        
        {board.columns.map((column: KanbanColumn, columnIndex: number) => (
          <div 
            key={column.id} 
            className="relative w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)] transition-transform duration-200 ease-in-out overflow-visible"
            style={{ 
              transform: `translateX(${getColumnShift(columnIndex)}px)`,
              opacity: draggingColumnId === column.id ? '0.5' : '1',
            }}
          >
            {/* Left column drop zone */}
            <div 
              className={`absolute left-0 top-0 bottom-0 w-36 -ml-16 ${
                isDraggingColumn ? 'pointer-events-auto' : 'pointer-events-none'
              } z-20`}
              ref={el => leftDropRefs.current[columnIndex] = el}
            />
            
            {/* Column content with higher z-index */}
            <div className="relative z-30 w-full">
              <KanbanColumn
                column={column}
                columnIndex={columnIndex}
                onTitleChange={(title) => updateColumnTitle(column.id, title)}
                onDeleteClick={() => setDeleteTarget({ type: 'column', id: column.id })}
                onTaskClick={setSelectedTask}
                onTaskDeleteClick={(taskId) => setDeleteTarget({ type: 'task', id: taskId, columnId: column.id })}
                onAddTaskClick={() => addTask(column.id)}
              />
            </div>

            {/* Right column drop zone */}
            <div 
              className={`absolute right-0 top-0 bottom-0 w-36 -mr-16 ${
                isDraggingColumn ? 'pointer-events-auto' : 'pointer-events-none'
              } z-20`}
              ref={el => rightDropRefs.current[columnIndex] = el}
            >
              <div className="w-4 h-full ml-auto" />
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget?.type === 'column') {
            deleteColumn(deleteTarget.id);
          } else if (deleteTarget?.type === 'task' && deleteTarget.columnId) {
            deleteTask(deleteTarget.id, deleteTarget.columnId);
          }
        }}
        title={`Delete ${deleteTarget?.type === 'column' ? 'Column' : 'Task'}`}
        message={`Are you sure you want to delete this ${deleteTarget?.type}? This action cannot be undone.`}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(updatedTask: KanbanTask) => {
          const column = board.columns.find((col: KanbanColumn) => col.id === updatedTask.columnId);
          if (column) {
            updateTask(updatedTask.id, column.id, updatedTask);
          }
        }}
        onDelete={(task) => {
          setSelectedTask(null);
          setDeleteTarget({ type: 'task', id: task.id, columnId: task.columnId });
        }}
      />
    </div>
  );
} 