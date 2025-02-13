import type { TableViewModel, ViewColumn, Task } from '@/types';
import { TableCell } from './TableCell';
import { AddColumnButton } from './AddColumnButton';
import { AddTaskRow } from './AddTaskRow';
import { useProjectStore } from '@/stores/project';
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteColumnDialog } from './DeleteColumnDialog';

interface TableGridProps {
  tasks: Task[];
  view: TableViewModel;
}

const MIN_COLUMN_WIDTHS = {
  text: 200,
  status: 120,
  user: 150,
  person: 150,
  date: 120,
  number: 120,
  default: 100,
};

const MAX_COLUMN_WIDTH = 600;

function getColumnWidth(column: ViewColumn): number {
  return column.width || MIN_COLUMN_WIDTHS[column.type || 'default'];
}

export function TableGrid({ tasks, view }: TableGridProps) {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const [localColumns, setLocalColumns] = useState(view.columns);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [draggedRowId, setDraggedRowId] = useState<string | null>(null);
  
  const resizeRef = useRef<{
    columnId: string | null;
    startX: number;
    startWidth: number;
  }>({
    columnId: null,
    startX: 0,
    startWidth: 0,
  });

  const tableRef = useRef<HTMLDivElement>(null);

  // Global state and actions
  const { updateView, updateViewConfig, updateTask } = useProjectStore();

  // Update local columns when view changes
  useEffect(() => {
    setLocalColumns(view.columns);
  }, [view.columns]);

  const handleStartEditing = (column: ViewColumn) => {
    setEditingColumnId(column.id);
    setEditingTitle(column.title);
  };

  const handleFinishEditing = async () => {
    if (!editingColumnId) return;

    const updatedColumns = localColumns.map(col =>
      col.id === editingColumnId
        ? { ...col, title: editingTitle }
        : col
    );

    try {
      await updateView(view.id, { columns: updatedColumns });
      setEditingColumnId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Failed to update column title:', error);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    const updatedColumns = localColumns.filter(col => col.id !== columnId);
    
    try {
      setDeleteColumnId(null);
      setLocalColumns(updatedColumns);
      await updateView(view.id, { columns: updatedColumns });
    } catch (error) {
      console.error('Failed to delete column:', error);
      setLocalColumns(view.columns);
    }
  };

  const handleAddColumn = async (column: Partial<ViewColumn>) => {
    const newColumn = {
      ...column,
      id: crypto.randomUUID(),
    } as ViewColumn;

    setLocalColumns(prev => {
      const newColumns = [...prev, newColumn];
      updateView(view.id, { columns: newColumns }).catch(error => {
        console.error('Failed to add column:', error);
        setLocalColumns(view.columns);
      });
      return newColumns;
    });
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: string, currentWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!tableRef.current) return;
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    setIsResizing(true);
    
    const tableRect = tableRef.current.getBoundingClientRect();
    
    resizeRef.current = {
      columnId,
      startX: e.clientX - tableRect.left,
      startWidth: currentWidth,
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeRef.current.columnId || !tableRef.current) return;
    
    const tableRect = tableRef.current.getBoundingClientRect();
    const mouseX = e.clientX - tableRect.left;
    const diff = mouseX - resizeRef.current.startX;
    
    const column = localColumns.find(col => col.id === resizeRef.current.columnId);
    if (!column) return;

    const minWidth = MIN_COLUMN_WIDTHS[column.type || 'default'];
    const newWidth = Math.min(MAX_COLUMN_WIDTH, Math.max(minWidth, resizeRef.current.startWidth + diff));
    
    setLocalColumns(cols => 
      cols.map(col =>
        col.id === resizeRef.current.columnId
          ? { ...col, width: newWidth }
          : col
      )
    );
  }, [localColumns]);

  const handleMouseUp = useCallback(async () => {
    if (resizeRef.current.columnId) {
      try {
        await updateView(view.id, { columns: localColumns });
      } catch (error) {
        console.error('Failed to update column width:', error);
        setLocalColumns(view.columns);
      }
    }
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    setIsResizing(false);
    resizeRef.current = { columnId: null, startX: 0, startWidth: 0 };
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [updateView, view.id, localColumns, view.columns]);

  const handleColumnDragStart = () => {
    setDraggedColumnId('dragging');
  };

  const handleColumnDragEnd = async (result: any) => {
    const { source, destination, type } = result;
    
    if (!destination) return;

    // Handle column reordering
    if (type === 'COLUMN') {
      if (result.draggableId === localColumns[0]?.id) return;
      
      const newColumns = Array.from(localColumns);
      const [removed] = newColumns.splice(source.index, 1);
      const destinationIndex = destination.index === 0 ? 1 : destination.index;
      newColumns.splice(destinationIndex, 0, removed);
      
      setLocalColumns(newColumns);
      try {
        await updateView(view.id, { columns: newColumns });
      } catch (error) {
        console.error('Failed to reorder columns:', error);
        setLocalColumns(view.columns);
      }
    }
  };

  const handleRowDragStart = () => {
    setDraggedRowId('dragging');
  };

  const handleRowDragEnd = async (result: any) => {
    setDraggedRowId(null);
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    const allTasks = [...tasks].sort((a, b) => (a.position || 0) - (b.position || 0));
    const newPosition = calculateNewPosition(allTasks, destinationIndex);
    
    try {
      await updateTask(result.draggableId, { position: newPosition });
    } catch (error) {
      console.error('Failed to reorder task:', error);
    }
  };

  const calculateNewPosition = (tasks: Task[], destinationIndex: number): number => {
    if (tasks.length === 0) return 0;
    if (destinationIndex === 0) return (tasks[0]?.position || 0) - 1024;
    if (destinationIndex >= tasks.length) return (tasks[tasks.length - 1]?.position || 0) + 1024;
    
    const prevTask = tasks[destinationIndex - 1];
    const nextTask = tasks[destinationIndex];
    return ((prevTask?.position || 0) + (nextTask?.position || 0)) / 2;
  };

  const renderCell = (task: Task, column: ViewColumn) => (
    <TableCell
      key={column.id}
      type={column.type}
      task={task}
      column={column}
      statusConfig={view.config.status_config}
      onStatusConfigChange={handleStatusConfigChange}
    />
  );

  const handleStatusConfigChange = async (config: any) => {
    try {
      await updateViewConfig(view.id, {
        ...view.config,
        status_config: config,
      });
    } catch (error) {
      console.error('Failed to update status config:', error);
    }
  };

  return (
    <div className="relative flex-1 overflow-auto" ref={tableRef}>
      <div className="bg-background rounded-lg border shadow-sm w-full">
        <div className="flex flex-col">
          {/* Just the draggable header */}
          <DragDropContext onDragEnd={handleColumnDragEnd} onDragStart={handleColumnDragStart}>
            <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex border-b border-border"
                >
                  <div className="flex w-full">
                    {localColumns.map((column, index) => (
                      <Draggable
                        key={column.id}
                        draggableId={column.id}
                        index={index}
                        isDragDisabled={index === 0}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "h-9 flex items-center shrink-0 group relative",
                              index === 0 && "bg-muted/5",
                              snapshot.isDragging && "z-50 shadow-md bg-background/90 rounded-sm",
                              index !== 0 && "border-l border-border"
                            )}
                            style={{
                              ...provided.draggableProps.style,
                              width: getColumnWidth(column),
                              minWidth: MIN_COLUMN_WIDTHS[column.type || 'default'],
                            }}
                          >
                            {/* Drag Handle */}
                            {index !== 0 && (
                              <div 
                                {...provided.dragHandleProps}
                                className="absolute left-2 flex items-center h-full opacity-0 group-hover:opacity-100 cursor-grab"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}

                            {/* Column Content */}
                            <div className="flex items-center w-full px-4">
                              <div className={cn(
                                "flex-1",
                                index === 0 ? "pl-8 text-left" : "text-center"
                              )}>
                                {column.title}
                              </div>
                              {/* Column Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                {!index && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                          "h-6 w-6 p-0",
                                          (isResizing || draggedColumnId) && "pointer-events-none opacity-0"
                                        )}
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">More options</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleStartEditing(column)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Rename
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setDeleteColumnId(column.id);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                                {index !== 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                      "h-6 w-6 p-0",
                                      (isResizing || draggedColumnId) && "pointer-events-none opacity-0"
                                    )}
                                    onClick={() => handleStartEditing(column)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span className="sr-only">Edit column name</span>
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Resize Handle */}
                            <div
                              className={cn(
                                "absolute right-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-primary/20 z-20",
                                isResizing && resizeRef.current.columnId === column.id && "bg-primary/20"
                              )}
                              onMouseDown={(e) => handleResizeStart(e, column.id, getColumnWidth(column))}
                              style={{ transform: 'translateX(50%)' }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {/* Single border div at the end */}
                    <div className="border-l border-border shrink" />
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Body with Row Dragging - Separate Context */}
          <DragDropContext onDragEnd={handleRowDragEnd} onDragStart={handleRowDragStart}>
            <Droppable droppableId="tasks" type="ROW">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col"
                >
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "flex group relative w-full",
                            snapshot.isDragging && "z-50 shadow-sm bg-background"
                          )}
                        >
                          {localColumns.map((column, colIndex) => (
                            <div
                              key={column.id}
                              className={cn(
                                "flex items-center border-b p-2 shrink-0",
                                colIndex === 0 ? "text-left relative" : "text-center",
                                colIndex !== 0 && "border-l border-border"
                              )}
                              style={{
                                width: getColumnWidth(column),
                                minWidth: MIN_COLUMN_WIDTHS[column.type || 'default'],
                              }}
                            >
                              {colIndex === 0 && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 z-10 h-8 w-8"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <div className={cn("w-full", colIndex === 0 && "pl-8")}>
                                {renderCell(task, column)}
                              </div>
                            </div>
                          ))}
                          <div className="border-b border-l border-border flex-1" />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="flex">
                    <div className="w-full p-0">
                      <AddTaskRow columns={localColumns} />
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <DeleteColumnDialog 
        open={!!deleteColumnId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteColumnId(null);
          }
        }}
        onConfirm={() => {
          if (deleteColumnId) {
            handleDeleteColumn(deleteColumnId);
          }
        }}
      />
    </div>
  );
}
