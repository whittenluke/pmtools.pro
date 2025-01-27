import type { ViewModel, ViewColumn } from '@/types';
import type { Database } from '@/types/supabase';
import { TableCell } from './TableCell';
import { AddColumnButton } from './AddColumnButton';
import { AddTaskRow } from './AddTaskRow';
import { useProjectStore } from '@/stores/project';
import { X, Pencil, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
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

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableGridProps {
  tasks: Task[];
  view: ViewModel;
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
  const [localColumns, setLocalColumns] = useState(view.columns || []);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  
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
  const { updateView, updateViewConfig } = useProjectStore();

  // Update local columns when view changes
  useEffect(() => {
    setLocalColumns(view.columns || []);
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
    
    // Optimistic update
    setLocalColumns(updatedColumns);
    setDeleteColumnId(null);

    try {
      await updateView(view.id, { columns: updatedColumns });
    } catch (error) {
      console.error('Failed to delete column:', error);
      // Revert on failure
      setLocalColumns(view.columns || []);
    }
  };

  const handleAddColumn = async (column: Partial<ViewColumn>) => {
    const newColumn = {
      ...column,
      id: crypto.randomUUID(),
    };

    // Optimistic update
    setLocalColumns(prev => {
      const newColumns = [...prev, newColumn];
      // Update view with the new state
      updateView(view.id, { columns: newColumns }).catch(error => {
        console.error('Failed to add column:', error);
        // Revert on failure
        setLocalColumns(view.columns || []);
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
        setLocalColumns(view.columns || []);
      }
    }
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    setIsResizing(false);
    resizeRef.current = { columnId: null, startX: 0, startWidth: 0 };
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [updateView, view.id, localColumns, view.columns]);

  const handleDragStart = () => {
    setDraggedColumnId('dragging');
  };

  const handleDragEnd = async (result: any) => {
    setDraggedColumnId(null);
    if (!result.destination) return;
    
    // Prevent moving the title column
    if (result.draggableId === localColumns[0]?.id) return;
    
    const newColumns = Array.from(localColumns);
    const [removed] = newColumns.splice(result.source.index, 1);
    
    // Ensure title column stays first by preventing drops at index 0
    const destinationIndex = result.destination.index === 0 ? 1 : result.destination.index;
    newColumns.splice(destinationIndex, 0, removed);
    
    setLocalColumns(newColumns);
    
    try {
      await updateView(view.id, { columns: newColumns });
    } catch (error) {
      console.error('Failed to reorder columns:', error);
      setLocalColumns(view.columns || []);
    }
  };

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

  const renderCell = (task: Task, column: ViewColumn) => {
    const value = task[column.id as keyof Task];
    
    return (
      <TableCell
        key={column.id}
        type={column.type}
        value={value}
        task={task}
        column={column}
        statusConfig={column.type === 'status' ? view.config?.status_config : undefined}
        onStatusConfigChange={column.type === 'status' ? handleStatusConfigChange : undefined}
      />
    );
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="relative flex-1 overflow-auto">
          <div className="bg-background rounded-lg border shadow-sm">
            <table className="border-separate border-spacing-0">
              <colgroup>
                {localColumns.map((column, index) => (
                  <col 
                    key={column.id} 
                    style={{ 
                      width: `${getColumnWidth(column)}px`,
                    }} 
                  />
                ))}
                <col style={{ width: "200px" }} />
              </colgroup>
              
              <Droppable droppableId="columns" direction="horizontal">
                {(provided) => (
                  <thead
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <tr>
                      {localColumns.map((column, index) => {
                        const width = getColumnWidth(column);
                        const isTitle = index === 0;
                        
                        return (
                          <Draggable
                            key={column.id}
                            draggableId={column.id}
                            index={index}
                            isDragDisabled={isTitle}
                          >
                            {(provided, snapshot) => (
                              <th
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={cn(
                                  "relative group border-b border-border p-0 bg-background",
                                  isTitle && "bg-muted/5",
                                  snapshot.isDragging ? "z-50" : "",
                                  isResizing && resizeRef.current.columnId === column.id ? "select-none" : "",
                                  index !== 0 && "border-l border-border"
                                )}
                              >
                                <div 
                                  className={cn(
                                    "h-9 px-4 py-2 text-sm font-medium text-foreground flex items-center gap-2 transition-colors relative",
                                    snapshot.isDragging ? "bg-background shadow-lg rounded-md" : "hover:bg-muted/50",
                                    isResizing && "select-none"
                                  )}
                                >
                                  {!isTitle && (
                                    <div 
                                      {...provided.dragHandleProps}
                                      className={cn(
                                        "absolute left-0 flex items-center h-full px-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity",
                                        (isResizing || draggedColumnId) && "pointer-events-none opacity-0"
                                      )}
                                    >
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}

                                  <div className="flex-1 relative flex items-center">
                                    <div className={cn(
                                      "truncate font-medium w-full",
                                      index === 0 ? "text-left" : "text-center"
                                    )}>{column.title}</div>
                                    <div className="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background">
                                      {!isTitle && (
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
                                            <DropdownMenuItem onClick={() => setDeleteColumnId(column.id)}>
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}
                                      {isTitle && (
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
                                </div>

                                <div
                                  className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 z-20"
                                  onMouseDown={(e) => handleResizeStart(e, column.id, width)}
                                  style={{
                                    transform: 'translateX(50%)',
                                  }}
                                />
                              </th>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      <th className="border-b border-border p-0">
                        <div className="px-4 py-2">
                          <AddColumnButton onAddColumn={handleAddColumn} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                )}
              </Droppable>

              <tbody className="relative">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    {localColumns.map((column, index) => (
                      <td
                        key={column.id}
                        className={cn(
                          'border-b p-2',
                          index === 0 ? 'text-left' : 'text-center',
                          draggedColumnId && 'transition-none',
                          index !== 0 && 'border-l border-border'
                        )}
                      >
                        {renderCell(task, column)}
                      </td>
                    ))}
                    <td className="border-b p-2" />
                  </tr>
                ))}
                <tr>
                  <td colSpan={localColumns.length + 1} className="p-0">
                    <AddTaskRow columns={localColumns} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DragDropContext>

      <DeleteColumnDialog 
        open={!!deleteColumnId}
        onOpenChange={(open) => setDeleteColumnId(open ? deleteColumnId : null)}
        onConfirm={() => deleteColumnId && handleDeleteColumn(deleteColumnId)}
      />
    </>
  );
}