// Core Types
export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  status: 'active' | 'completed' | 'archived';
  owner_id: string;
}

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  project_id: string;
  assignee_id: string | null;
  due_date: string | null;
  start_date: string | null;
  priority: 'low' | 'medium' | 'high';
}

export interface Workspace {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  owner_id: string;
  settings: Record<string, unknown> | null;
}

// View System Types
export interface ViewColumn {
  id: string;
  key: keyof Task;
  type: 'text' | 'status' | 'date' | 'user' | 'priority';
  title: string;
  width?: number;
  config?: {
    format?: string;
    options?: Array<{ id: string; label: string; color?: string }>;
    validation?: Record<string, unknown>;
  };
}

export interface FilterConfig {
  id: string;
  field: keyof Task;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: unknown;
}

export interface SortConfig {
  field: keyof Task;
  direction: 'asc' | 'desc';
}

export interface GroupConfig {
  field: keyof Task;
  direction?: 'asc' | 'desc';
}

export interface ViewModel {
  id: string;
  type: 'table' | 'kanban' | 'calendar' | 'timeline';
  name: string;
  columns: ViewColumn[];
  filters: FilterConfig[];
  sorting: SortConfig[];
  grouping?: GroupConfig;
  config?: Record<string, unknown>;
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

// State Types
export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  tasks: Task[];
  views: ViewModel[];
  currentView: ViewModel | null;
  createProject: (project: Pick<Project, 'title' | 'description'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  createTask: (task: Pick<Task, 'title' | 'description' | 'project_id' | 'due_date' | 'priority'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setCurrentView: (view: ViewModel | null) => void;
  updateView: (id: string, view: Partial<ViewModel>) => Promise<void>;
}