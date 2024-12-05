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
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskClick: (task: KanbanTask) => void;
  onTaskDeleteClick: (taskId: string) => void;
  onAddTaskClick: () => void;
}

interface KanbanTaskProps {
  task: KanbanTask;
  taskIndex: number;
  columnId: string;
  onUpdate: (updates: Partial<KanbanTask>) => void;
  onClick: () => void;
  onDeleteClick: () => void;
  isDragging: boolean;
}

function KanbanTask({
  task,
  taskIndex,
  columnId,
  onUpdate,
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
      className={`bg-white p-2 sm:p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
      <input
        type="text"
        id={`task-title-${task.id}`}
        name={`task-title-${task.id}`}
        value={task.title || ''}
        onChange={(e) => onUpdate({ title: e.target.value })}
        className="text-sm sm:text-base font-medium w-full bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 cursor-text"
        placeholder="Task Title"
      />
      <textarea
        id={`task-description-${task.id}`}
        name={`task-description-${task.id}`}
        value={task.description || ''}
        onChange={(e) => onUpdate({ description: e.target.value })}
        className="mt-1 sm:mt-2 w-full text-xs sm:text-sm text-gray-500 bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 resize-none"
        placeholder="Add description..."
        rows={2}
      />
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
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
  );
}

function KanbanColumn({
  column,
  columnIndex,
  onTitleChange,
  onDeleteClick,
  onTaskUpdate,
  onTaskClick,
  onTaskDeleteClick,
  onAddTaskClick,
}: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const dropTargetsRef = useRef<Map<string, () => void>>(new Map());

  // Cleanup drop targets on unmount
  useEffect(() => {
    return () => {
      dropTargetsRef.current.forEach(cleanup => cleanup());
      dropTargetsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const handleDragStart = (event: Event) => {
      const e = event as CustomEvent;
      if (e.detail.type === 'task') {
        setDraggingTaskId(e.detail.id);
      }
    };

    const handleDragEnd = (event: Event) => {
      const e = event as CustomEvent;
      if (e.detail.type === 'task') {
        setDraggingTaskId(null);
      }
      setIsDraggingOver(false);
      setInsertAtIndex(null);
    };

    const handleDragComplete = () => {
      setIsDraggingOver(false);
      setInsertAtIndex(null);
      setDraggingTaskId(null);
    };

    const handleUpdateInsertPosition = (event: Event) => {
      const e = event as CustomEvent;
      if (e.target && columnRef.current?.contains(e.target as Node)) {
        setInsertAtIndex(e.detail.index);
        setIsDraggingOver(true);
      } else {
        setInsertAtIndex(null);
        setIsDraggingOver(false);
      }
    };

    document.addEventListener('dragStart', handleDragStart);
    document.addEventListener('dragEnd', handleDragEnd);
    document.addEventListener('dragComplete', handleDragComplete);
    document.addEventListener('updateInsertPosition', handleUpdateInsertPosition);

    return () => {
      document.removeEventListener('dragStart', handleDragStart);
      document.removeEventListener('dragEnd', handleDragEnd);
      document.removeEventListener('dragComplete', handleDragComplete);
      document.removeEventListener('updateInsertPosition', handleUpdateInsertPosition);
      setIsDraggingOver(false);
      setDraggingTaskId(null);
      setInsertAtIndex(null);
    };
  }, []);

  useEffect(() => {
    if (!columnRef.current) return;
    
    return setupDraggable(columnRef.current, {
      type: 'column',
      id: column.id,
      sourceIndex: columnIndex
    });
  }, [column.id, columnIndex]);

  const setupTaskDropTarget = (element: HTMLElement | null, taskId: string, index: number) => {
    if (!element) {
      // Cleanup old drop target if element is removed
      const cleanup = dropTargetsRef.current.get(taskId);
      if (cleanup) {
        cleanup();
        dropTargetsRef.current.delete(taskId);
      }
      return;
    }

    // Setup new drop target
    const cleanup = setupDropTarget(
      element,
      () => {},
      () => {},
      () => ({ id: column.id, index })
    );

    // Store cleanup function
    dropTargetsRef.current.set(taskId, cleanup);
  };

  const renderInsertionLine = (index: number) => (
    <div 
      className={`absolute h-0.5 left-0 right-0 bg-indigo-500 ${
        index === 0 ? '-top-0.5' : '-bottom-0.5'
      }`} 
    />
  );

  return (
    <div
      ref={columnRef}
      className={`bg-gray-50 rounded-lg p-4 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)] cursor-grab active:cursor-grabbing ${
        isDraggingOver ? 'ring-2 ring-indigo-500' : ''
      }`}
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

      <div className="space-y-2 min-h-[50px]">
        {column.tasks.map((task, taskIndex) => (
          <div 
            key={task.id} 
            className="relative"
            ref={el => setupTaskDropTarget(el, task.id, taskIndex)}
          >
            {isDraggingOver && insertAtIndex === taskIndex && renderInsertionLine(0)}
            <KanbanTask
              task={task}
              taskIndex={taskIndex}
              columnId={column.id}
              onUpdate={(updates) => onTaskUpdate(task.id, updates)}
              onClick={() => onTaskClick(task)}
              onDeleteClick={() => onTaskDeleteClick(task.id)}
              isDragging={task.id === draggingTaskId}
            />
            {isDraggingOver && insertAtIndex === taskIndex + 1 && renderInsertionLine(1)}
          </div>
        ))}

        {/* Empty column drop target */}
        <div 
          className="min-h-[50px]"
          ref={el => setupTaskDropTarget(el, `${column.id}-empty`, column.tasks.length)}
        />
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

  const updateColumnTitle = (columnId: string, title: string) => {
    setBoard({
      ...board,
      columns: board.columns.map((col: KanbanColumn) =>
        col.id === columnId ? { ...col, title } : col
      )
    });
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

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4">
        {board.columns.map((column: KanbanColumn, columnIndex: number) => (
          <KanbanColumn
            key={column.id}
            column={column}
            columnIndex={columnIndex}
            onTitleChange={(title) => updateColumnTitle(column.id, title)}
            onDeleteClick={() => setDeleteTarget({ type: 'column', id: column.id })}
            onTaskUpdate={(taskId, updates) => updateTask(taskId, column.id, updates)}
            onTaskClick={setSelectedTask}
            onTaskDeleteClick={(taskId) => setDeleteTarget({ type: 'task', id: taskId, columnId: column.id })}
            onAddTaskClick={() => addTask(column.id)}
          />
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