import { useState, useCallback } from 'react';
import type { Column } from '@/types';

const defaultColumns: Column[] = [
  { id: 'title', key: 'title', title: 'Title', type: 'text' },
  { id: 'status', key: 'status', title: 'Status', type: 'status' },
  { id: 'assignee', key: 'assignee_id', title: 'Assignee', type: 'user' },
  { id: 'due_date', key: 'due_date', title: 'Due Date', type: 'date' }
];

export function useTableColumns() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);

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