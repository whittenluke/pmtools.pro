import { useCallback } from 'react';
import { useProjectStore } from '@/stores/project';
import type { ViewColumn } from '@/types';

export function useViewState(viewId: string) {
  const { updateView, currentView } = useProjectStore();

  const updateColumns = useCallback(async (columns: ViewColumn[]) => {
    if (!currentView) return;
    
    try {
      await updateView(viewId, {
        columns,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update columns:', error);
      throw error;
    }
  }, [viewId, updateView, currentView]);

  const addColumn = useCallback(async (column: Partial<ViewColumn>) => {
    if (!currentView?.columns) return;

    const newColumn = {
      id: crypto.randomUUID(),
      title: column.title || 'New Column',
      type: column.type || 'text',
      width: column.width || 200,
      ...column
    };

    const updatedColumns = [...currentView.columns, newColumn];
    await updateColumns(updatedColumns);
  }, [currentView, updateColumns]);

  const removeColumn = useCallback(async (columnId: string) => {
    if (!currentView?.columns) return;

    const updatedColumns = currentView.columns.filter(col => col.id !== columnId);
    await updateColumns(updatedColumns);
  }, [currentView, updateColumns]);

  const reorderColumns = useCallback(async (startIndex: number, endIndex: number) => {
    if (!currentView?.columns) return;

    const result = Array.from(currentView.columns);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    await updateColumns(result);
  }, [currentView, updateColumns]);

  const updateColumnWidth = useCallback(async (columnId: string, width: number) => {
    if (!currentView?.columns) return;

    const updatedColumns = currentView.columns.map(col =>
      col.id === columnId ? { ...col, width } : col
    );

    await updateColumns(updatedColumns);
  }, [currentView, updateColumns]);

  return {
    columns: currentView?.columns || [],
    addColumn,
    removeColumn,
    reorderColumns,
    updateColumnWidth
  };
} 