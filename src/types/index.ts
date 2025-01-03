// Core Types
import type { Json } from './supabase';

export type ViewColumn = {
  id: string;
  title: string;
  type: 'text' | 'status' | 'date' | 'user';
  key?: string;
  width?: number;
  config?: Record<string, any>;
};

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