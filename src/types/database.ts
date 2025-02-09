import type { Database as GeneratedDatabase } from './supabase';

// Core database types from Supabase
export type Tables = GeneratedDatabase['public']['Tables'];
export type Json = GeneratedDatabase['public']['Tables']['projects']['Row']['settings'];

// Base database row types
export type DbProject = Tables['projects']['Row'];
export type DbTask = Tables['tasks']['Row'];
export type DbProjectView = Tables['project_views']['Row'];
export type DbWorkspaceMember = Tables['workspace_members']['Row'];
export type DbProfile = Tables['profiles']['Row'];

// Column and view types
export type ColumnType = 'text' | 'number' | 'status' | 'date' | 'user' | 'person' | 'people';

export type ViewColumn = {
  id: string;
  title: string;
  type: ColumnType;
  width?: number;
  config?: Record<string, any>;
};

export type Status = {
  id: string;
  title: string;
  color: string;
  position: number;
  type: 'default' | 'custom';
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

// Extended application types with additional properties
export type Project = DbProject;

export type Task = DbTask & {
  workspace_id?: string;
  projects?: {
    workspace_id: string;
  };
  start_date?: string;
  due_date?: string;
  column_values?: {
    [key: string]: {
      value: string | number | boolean | null;
      metadata?: Record<string, any>;
    };
  };
};

export type ProjectView = Omit<DbProjectView, 'config' | 'type'> & {
  type: 'table' | 'kanban' | 'timeline' | 'calendar';
  columns: ViewColumn[];
  config: TableConfig;
};

export type WorkspaceMember = DbWorkspaceMember & {
  profile?: Profile;
  user_id: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
};

export type Profile = DbProfile & {
  full_name: string;
  avatar_url: string;
  email: string;
}; 