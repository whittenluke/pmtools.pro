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

export type ProjectView = Database['public']['Tables']['project_views']['Row'] & {
  columns: ViewColumn[];
  config: Json & {
    status_config?: StatusConfig;
    tables?: Array<{
      id: string;
      title: string;
      tasks: Task[];
    }>;
    [key: string]: any;
  };
};

export type ViewModel = ProjectView & {
  type: 'table' | 'kanban' | 'timeline' | 'calendar';
  columns: ViewColumn[];
  config: NonNullable<ProjectView['config']>;
  status_config: StatusConfig;
};

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

export interface ViewConfig {
  status_config?: StatusConfig;
  [key: string]: any;
}

export type ProjectState = {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: Error | null;
  views: ProjectView[];
  currentView: ProjectView | null;
  
  // Project actions
  fetchProject: (id: string) => Promise<void>;
  createProject: (project: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  
  // View actions
  fetchViews: (projectId: string) => Promise<void>;
  createView: (view: Partial<ProjectView>) => Promise<ProjectView>;
  updateView: (id: string, view: Partial<ProjectView>) => Promise<void>;
  deleteView: (id: string) => Promise<void>;
  setCurrentView: (view: ProjectView | null) => void;
};