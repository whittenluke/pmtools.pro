export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  tags: string[];
  columnId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: KanbanColumn[];
}

export type ViewMode = 'kanban' | 'table'; 