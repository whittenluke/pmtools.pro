import type { Database as GeneratedDatabase } from './supabase';

// Core database types from Supabase
export type Database = GeneratedDatabase;
export type SchemaName = 'public';
export type Tables = Database['public']['Tables'];
export type Json = Database['public']['Tables']['projects']['Row']['settings'];

// Base database row types
export type DbProject = Tables['projects']['Row'];
export type DbTask = Tables['tasks']['Row'];
export type DbProjectView = Tables['project_views']['Row'];
export type DbWorkspaceMember = Tables['workspace_members']['Row'];
export type DbProfile = Tables['profiles']['Row'];

// Export Supabase operation types
export type TaskUpdate = Tables['tasks']['Update'];
export type TaskInsert = Tables['tasks']['Insert'];
export type ProjectViewUpdate = Tables['project_views']['Update'];
export type ProjectViewInsert = Tables['project_views']['Insert'];
export type ProjectUpdate = Tables['projects']['Update'];
export type ProjectInsert = Tables['projects']['Insert'];

export type TaskColumnValues = Record<string, any>;

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
export type Project = DbProject & {
  settings?: Json;
};

export type Task = DbTask & {
  workspace_id?: string;
  projects?: {
    workspace_id: string;
  };
  start_date?: string;
  due_date?: string;
  column_values: Json;
};

export type ProjectView = DbProjectView & {
  type: 'table' | 'kanban' | 'timeline' | 'calendar';
  columns: ViewColumn[];
  config: TableConfig;
};

export type WorkspaceMember = DbWorkspaceMember & {
  profile: Profile;
  email?: string;
};

export type Profile = DbProfile & {
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type ColumnValue = {
  value: string | number | boolean | null;
  label?: string;
  color?: string;
}; 