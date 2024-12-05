import { Plus, X } from 'lucide-react';
import type { KanbanBoard, KanbanTask } from '../../types/kanban';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { useState } from 'react';
import { TaskDetailsModal } from './TaskDetailsModal';

interface KanbanViewProps {
  board: KanbanBoard;
  setBoard: (board: KanbanBoard) => void;
  addTask: (columnId: string) => void;
}

export function KanbanView({ board, setBoard, addTask }: KanbanViewProps) {
  const { supabase } = useSupabase();
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);

  const deleteColumn = async (columnId: string) => {
    // Update UI immediately
    setBoard({
      ...board,
      columns: board.columns.filter(col => col.id !== columnId)
    });

    // Delete from database
    try {
      await supabase
        .from('kanban_columns')
        .delete()
        .eq('id', columnId);
      
      // Note: We don't need to explicitly delete tasks
      // because we set up ON DELETE CASCADE in the database
    } catch (error) {
      console.error('Error deleting column:', error);
      // Could add error handling/rollback here
    }
  };

  const updateTask = async (taskId: string, columnId: string, updates: Partial<KanbanTask>) => {
    // Update UI immediately
    setBoard({
      ...board,
      columns: board.columns.map(col => 
        col.id === columnId ? {
          ...col,
          tasks: col.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        } : col
      )
    });

    // Persist to database
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
      columns: board.columns.map(col =>
        col.id === columnId ? { ...col, title } : col
      )
    });
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Create new board state
    const newBoard = structuredClone(board);
    const sourceCol = newBoard.columns.find(col => col.id === source.droppableId);
    const destCol = newBoard.columns.find(col => col.id === destination.droppableId);
    
    if (!sourceCol || !destCol) return;

    // Remove task from source
    const [task] = sourceCol.tasks.splice(source.index, 1);
    // Add task to destination
    destCol.tasks.splice(destination.index, 0, task);

    // Update positions
    destCol.tasks.forEach((task, index) => {
      task.position = index;
    });

    // Update UI immediately
    setBoard(newBoard);

    try {
      // Update task in database
      await supabase
        .from('kanban_tasks')
        .update({ 
          column_id: destination.droppableId,
          position: destination.index 
        })
        .eq('id', task.id);

      // Update positions of other tasks in the destination column
      const updates = destCol.tasks.map((task, index) => ({
        id: task.id,
        position: index
      }));

      await supabase
        .from('kanban_tasks')
        .upsert(updates, { onConflict: 'id' });

    } catch (error) {
      console.error('Error updating task positions:', error);
      // Could add error handling/rollback here
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
          {board.columns.map(column => (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg p-4 w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={column.title}
                  onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                  className="text-base sm:text-lg font-medium bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 w-full"
                  placeholder="Column Title"
                />
                <button
                  onClick={() => deleteColumn(column.id)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[50px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedTask(task)}
                            className="bg-white p-2 sm:p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => updateTask(task.id, column.id, { title: e.target.value })}
                              className="text-sm sm:text-base font-medium w-full bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                              placeholder="Task Title"
                            />
                            <textarea
                              value={task.description}
                              onChange={(e) => updateTask(task.id, column.id, { description: e.target.value })}
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                onClick={() => addTask(column.id)}
                className="w-full mt-3 sm:mt-4 p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded flex items-center justify-center gap-1 text-sm sm:text-base"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Add Task
              </button>
            </div>
          ))}
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(updatedTask: KanbanTask) => {
          const column = board.columns.find(col => col.id === updatedTask.columnId);
          if (column) {
            updateTask(updatedTask.id, column.id, updatedTask);
          }
        }}
      />
    </DragDropContext>
  );
} 