import { Plus, X } from 'lucide-react';
import type { KanbanBoard, KanbanTask } from '../../types/kanban';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface KanbanViewProps {
  board: KanbanBoard;
  setBoard: (board: KanbanBoard) => void;
  addTask: (columnId: string) => void;
}

export function KanbanView({ board, setBoard, addTask }: KanbanViewProps) {
  const deleteColumn = (columnId: string) => {
    setBoard({
      ...board,
      columns: board.columns.filter(col => col.id !== columnId)
    });
  };

  const updateTask = (taskId: string, columnId: string, updates: Partial<KanbanTask>) => {
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
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    setBoard({
      ...board,
      columns: board.columns.map(col =>
        col.id === columnId ? { ...col, title } : col
      )
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // Moving between columns
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = board.columns.find(col => col.id === source.droppableId);
      const destColumn = board.columns.find(col => col.id === destination.droppableId);
      
      if (sourceColumn && destColumn) {
        const sourceTasks = [...sourceColumn.tasks];
        const destTasks = [...destColumn.tasks];
        const [movedTask] = sourceTasks.splice(source.index, 1);
        
        destTasks.splice(destination.index, 0, { ...movedTask, columnId: destination.droppableId });
        
        setBoard({
          ...board,
          columns: board.columns.map(col => {
            if (col.id === source.droppableId) {
              return { ...col, tasks: sourceTasks };
            }
            if (col.id === destination.droppableId) {
              return { ...col, tasks: destTasks };
            }
            return col;
          })
        });
      }
    } else {
      // Moving within the same column
      const column = board.columns.find(col => col.id === source.droppableId);
      if (column) {
        const copiedTasks = [...column.tasks];
        const [movedTask] = copiedTasks.splice(source.index, 1);
        copiedTasks.splice(destination.index, 0, movedTask);
        
        setBoard({
          ...board,
          columns: board.columns.map(col =>
            col.id === source.droppableId ? { ...col, tasks: copiedTasks } : col
          )
        });
      }
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
                            className="bg-white p-2 sm:p-3 rounded shadow-sm hover:shadow-md transition-shadow"
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
    </DragDropContext>
  );
} 