import { useState, useCallback } from 'react';
import type { ViewColumn } from '@/types';

const defaultColumns: ViewColumn[] = [
  { id: 'title', key: 'title', title: 'Title', type: 'text' },
  { id: 'status', key: 'status', title: 'Status', type: 'status' },
  { id: 'assignee', key: 'assignee_id', title: 'Assignee', type: 'user' },
  { id: 'due_date', key: 'due_date', title: 'Due Date', type: 'date' }
];

export function useTableColumns() {
  const [columns, setColumns] = useState<ViewColumn[]>(defaultColumns);

  const addColumn = useCallback(() => {
    // Implementation for adding a new column
    // This would typically open a modal to configure the new column
  }, []);

  const removeColumn = useCallback((columnId: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  }, []);

  const reorderColumns = useCallback((startIndex: number, endIndex: number) => {
    setColumns((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  return {
    columns,
    addColumn,
    removeColumn,
    reorderColumns
  };
}