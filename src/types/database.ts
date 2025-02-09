import { Database as GeneratedDatabase } from './supabase';

export type Tables = GeneratedDatabase['public']['Tables'];
export type DbProject = Tables['projects']['Row'];
export type DbTask = Tables['tasks']['Row'];
export type DbProjectView = Tables['project_views']['Row'];
export type DbWorkspaceMember = Tables['workspace_members']['Row'];
export type DbProfile = Tables['profiles']['Row'];

export type Project = DbProject;
export type Task = DbTask & {
  workspace_id?: string;
};

export type ProjectView = Omit<DbProjectView, 'config' | 'type'> & {
  type: 'table' | 'kanban' | 'timeline' | 'calendar';
  config: {
    columns?: any[];
    status_config?: {
      statuses: any[];
      defaultStatusId: string;
    };
  };
};

export type WorkspaceMember = DbWorkspaceMember & {
  profile?: DbProfile;
};

export type Profile = DbProfile;

export type Json = GeneratedDatabase['public']['Tables']['projects']['Row']['settings']; 