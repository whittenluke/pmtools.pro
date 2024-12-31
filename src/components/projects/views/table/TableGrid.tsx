import type { ViewModel, ViewColumn } from '@/types';
import type { Database } from '@/types/supabase';
import { TableCell } from './TableCell';
import { AddColumnButton } from './AddColumnButton';
import { useProjectStore } from '@/stores/project';
import { X, Pencil } from 'lucide-react';
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

type Task = Database['public']['Tables']['tasks']['Row'];

interface TableGridProps {
  tasks: Task[];
  view: ViewModel;
}

export function TableGrid({ tasks, view }: TableGridProps) {
  const { updateView } = useProjectStore();
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const [localColumns, setLocalColumns] = useState(view.columns || []);
  const resizeRef = useRef<{
    columnId: string | null;
    startX: number;
    startWidth: number;
  }>({
    columnId: null,
    startX: 0,
    startWidth: 0,
  });

  // Keep local state in sync with props
  useEffect(() => {
    setLocalColumns(view.columns || []);
  }, [view.columns]);

  const handleAddColumn = async (type: string) => {
    if (!localColumns) return;

    const newColumn = {
      id: crypto.randomUUID(),
      title: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      width: 200,
    };

    const updatedColumns = [...localColumns, newColumn];
    setLocalColumns(updatedColumns);
    await updateView(view.id, { columns: updatedColumns });
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!localColumns) return;

    const updatedColumns = localColumns.filter(col => col.id !== columnId);
    setLocalColumns(updatedColumns);
    await updateView(view.id, { columns: updatedColumns });
    setDeleteColumnId(null);
  };

  const handleStartEditing = (column: ViewColumn) => {
    setEditingColumnId(column.id);
    setEditingTitle(column.title);
  };

  const handleFinishEditing = async () => {
    if (!editingColumnId || !localColumns) return;

    const updatedColumns = localColumns.map(col => 
      col.id === editingColumnId 
        ? { ...col, title: editingTitle }
        : col
    );

    setLocalColumns(updatedColumns);
    await updateView(view.id, { columns: updatedColumns });
    setEditingColumnId(null);
    setEditingTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      setEditingColumnId(null);
      setEditingTitle('');
    }
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: string, currentWidth: number) => {
    e.preventDefault();
    resizeRef.current = {
      columnId,
      startX: e.clientX,
      startWidth: currentWidth,
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeRef.current.columnId || !localColumns) return;
    
    const diff = e.clientX - resizeRef.current.startX;
    const newWidth = Math.max(100, resizeRef.current.startWidth + diff);
    
    const updatedColumns = localColumns.map(col =>
      col.id === resizeRef.current.columnId ? { ...col, width: newWidth } : col
    );
    setLocalColumns(updatedColumns);
  }, [localColumns]);

  const handleMouseUp = useCallback(async () => {
    if (!resizeRef.current.columnId || !localColumns) return;
    
    const updatedColumns = [...localColumns];
    await updateView(view.id, { columns: updatedColumns });
    
    // Re-enable drag handle after resize is complete
    const dragHandles = document.querySelectorAll('[data-rbd-drag-handle-disabled]');
    dragHandles.forEach(handle => {
      handle.removeAttribute('data-rbd-drag-handle-disabled');
    });
    
    resizeRef.current = { columnId: null, startX: 0, startWidth: 0 };
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [localColumns, updateView, view.id, handleMouseMove]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !localColumns) return;

    const newColumns = Array.from(localColumns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, removed);

    setLocalColumns(newColumns);
    await updateView(view.id, { columns: newColumns });
  };

  return (
    <div className="w-full divide-y divide-border">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-muted/50 flex"
            >
              {localColumns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided, snapshot) => (
                    <>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group px-4 py-2 text-sm font-medium text-foreground flex-shrink-0 flex items-center justify-between gap-2 hover:bg-muted/80 transition-colors relative ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        style={{
                          width: column.width || 200,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div {...provided.dragHandleProps} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
                        
                        {editingColumnId === column.id ? (
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={handleFinishEditing}
                            onKeyDown={handleKeyDown}
                            className="h-6 text-sm font-medium relative z-10"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-1.5 flex-1 min-w-0 relative z-10">
                            <span className="truncate font-medium">{column.title}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleStartEditing(column)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit column name</span>
                            </Button>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 relative z-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={() => setDeleteColumnId(column.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete column</span>
                          </Button>
                        </div>

                        {/* Resize handle */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1 hover:w-2 bg-transparent hover:bg-primary/20 cursor-col-resize transition-all -mr-0.5 z-20"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Temporarily disable drag handle while resizing
                            const dragHandle = e.currentTarget.parentElement?.querySelector('[data-rbd-drag-handle-draggable-id]');
                            if (dragHandle) {
                              dragHandle.setAttribute('data-rbd-drag-handle-disabled', 'true');
                            }
                            handleResizeStart(e, column.id, column.width || 200);
                          }}
                        />
                      </div>
                    </>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="px-2 py-2">
                <AddColumnButton onAddColumn={handleAddColumn} />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="bg-background divide-y divide-border">
        {tasks.map((task) => (
          <div key={task.id} className="flex hover:bg-muted/50 cursor-pointer">
            {localColumns.map((column) => (
              <div 
                key={column.id}
                className="flex-shrink-0"
                style={{ width: column.width || 200 }}
              >
                <TableCell
                  task={task}
                  column={column}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <AlertDialog open={deleteColumnId !== null} onOpenChange={() => setDeleteColumnId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Column</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this column? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteColumnId && handleDeleteColumn(deleteColumnId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}