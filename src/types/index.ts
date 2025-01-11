// Core Types
import type { Json } from './supabase';

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

export interface ViewColumn {
  id: string;
  key?: string;
  title: string;
  type: ColumnType;
  width?: number;
  config?: NumberColumnConfig;
  isHidden?: boolean;
  isLocked?: boolean;
  isRequired?: boolean;
  validation?: {
    required?: boolean;
    unique?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
  };
}

export type Project = {
  id: string;
  title: string;
  description?: string;
  settings?: Record<string, any>;
  workspace_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ProjectView = {
  id: string;
  project_id: string;
  title: string;
  type: 'table' | 'kanban' | 'timeline' | 'calendar';
  status_config?: {
    statuses: Array<{
      id: string;
      type: string;
      color: string;
      title: string;
      position: number;
    }>;
    defaultStatusId: string;
  };
  columns: Array<{
    id: string;
    title: string;
    type: string;
    config?: Record<string, any>;
  }>;
  config?: Record<string, any>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

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