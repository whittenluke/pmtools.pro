// Core Types
import type { Json } from './supabase';
import type { Database } from './supabase';

// Base types from database
export type Task = Database['public']['Tables']['tasks']['Row'] & {
  workspace_id?: string;
};

export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type Project = Database['public']['Tables']['projects']['Row'];

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row'] & {
  profiles?: Profile;
};

// Column value types
export type ColumnValue = {
  value: string | number | boolean | null;
  metadata?: Record<string, any>;
};

export type TaskColumnValues = {
  status?: { value: string };
  [key: string]: ColumnValue | undefined;
};

// View types
export type ViewColumn = {
  id: string;
  title: string;
  type: 'text' | 'status' | 'user' | 'date' | 'number';
  width?: number;
  config?: Record<string, any>;
};

export type Status = {
  id: string;
  title: string;
  color: string;
  type: 'default' | 'custom';
  position: number;
};

export type StatusConfig = {
  statuses: Status[];
  defaultStatusId: string;
};

export type TableConfig = {
  tables: Array<{
    id: string;
    title: string;
    taskIds: string[];
  }>;
  status_config: StatusConfig;
};

// Base ProjectView type that matches exactly what's in the database
export type ProjectViewBase = Database['public']['Tables']['project_views']['Row'];

// Extended ProjectView type for use in the application
export type ProjectView = Omit<ProjectViewBase, 'config' | 'type'> & {
  columns: ViewColumn[];
  config: TableConfig;
  type: 'table' | 'kanban' | 'timeline' | 'calendar';
};

// View model types for specific view implementations
export type TableViewModel = ProjectView & {
  config: TableConfig;
};

export type KanbanViewModel = ProjectView & {
  config: {
    columns: Array<{
      id: string;
      title: string;
      taskIds: string[];
    }>;
    status_config: StatusConfig;
  };
};

export type TimelineViewModel = ProjectView & {
  config: {
    timeRange: {
      start: string;
      end: string;
    };
    status_config: StatusConfig;
  };
};

export type CalendarViewModel = ProjectView & {
  config: {
    view: 'month' | 'week' | 'day';
    status_config: StatusConfig;
  };
};

export type ViewModel = TableViewModel | KanbanViewModel | TimelineViewModel | CalendarViewModel;

export type ColumnType = 
  | 'text' 
  | 'number' 
  | 'status' 
  | 'date' 
  | 'user' 
  | 'person' 
  | 'people';

export interface NumberColumnConfig {
  mode?: 'decimal' | 'integer' | 'currency' | 'percentage' | 'rating';
  precision?: number;
  currency?: string;
  minValue?: number;
  maxValue?: number;
  aggregation?: 'sum' | 'average' | 'min' | 'max' | 'count';
}

export type ViewConfig = TableConfig | KanbanViewModel['config'] | TimelineViewModel['config'] | CalendarViewModel['config'];

export type ProjectState = {
  projects: Project[];
  currentProject: Project | null;
  currentView: ProjectView | null;
  views: ProjectView[];
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  taskUpdates: Map<string, Task>;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setCurrentProject: (project: Project | null) => void;
  setCurrentView: (view: ProjectView | null) => void;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  fetchViews: (projectId: string) => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  createProject: (title: string, description?: string) => Promise<Project>;
  createView: (projectId: string, title: string, type: 'table' | 'kanban' | 'timeline' | 'calendar') => Promise<ProjectView>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setDefaultView: (projectId: string, viewId: string) => Promise<void>;
  updateView: (viewId: string, data: Partial<ProjectView>) => Promise<void>;
  deleteView: (viewId: string) => Promise<void>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  optimisticUpdateTask: (taskId: string, data: Partial<Task>) => void;
  revertTaskUpdate: (taskId: string) => void;
  addView: (view: ProjectView) => void;
  updateViewLocally: (viewId: string, data: Partial<ProjectView>) => void;
  removeView: (viewId: string) => void;
  removeTask: (taskId: string) => void;
  createTask: (task: Partial<Task>) => Promise<Task>;
  updateViewConfig: (viewId: string, config: Partial<ViewConfig>) => Promise<void>;
};