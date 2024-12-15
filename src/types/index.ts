// Core Types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  project_id: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// Calendar Types
export interface CalendarState {
  currentDate: Date;
  visibleDays: Date[];
  view: 'month' | 'week' | 'day';
  setCurrentDate: (date: Date) => void;
  setView: (view: 'month' | 'week' | 'day') => void;
  nextMonth: () => void;
  prevMonth: () => void;
  nextWeek: () => void;
  prevWeek: () => void;
  nextDay: () => void;
  prevDay: () => void;
}

// View Types
export interface ViewConfig {
  columns?: ColumnConfig[];
  filters?: FilterConfig[];
  sorting?: SortConfig[];
  grouping?: GroupConfig;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  tasks: Task[];
  createProject: (project: Pick<Project, 'title' | 'description'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  createTask: (task: Pick<Task, 'title' | 'description' | 'project_id' | 'due_date'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

// Configuration Types
export interface ColumnConfig {
  id: string;
  field: string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface GroupConfig {
  field: string;
  direction?: 'asc' | 'desc';
}