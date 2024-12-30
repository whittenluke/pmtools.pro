import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];
type View = Database['public']['Tables']['project_views']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentView: View | null;
  views: View[];
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  setCurrentProject: (project: Project | null) => void;
  fetchProject: (id: string) => Promise<void>;
  fetchViews: (projectId: string) => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  createProject: (title: string, description?: string) => Promise<Project>;
  createView: (projectId: string, title: string, type: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setDefaultView: (projectId: string, viewId: string) => Promise<void>;
  updateView: (viewId: string, data: Partial<View>) => Promise<void>;
  deleteView: (viewId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  currentProject: null,
  currentView: null,
  views: [],
  tasks: [],
  loading: true,
  error: null,

  setCurrentProject: (project) => set({ currentProject: project }),

  fetchProject: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ currentProject: project, loading: false });
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  fetchViews: async (projectId) => {
    try {
      const { data: views, error: viewsError } = await supabase
        .from('project_views')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (viewsError) throw viewsError;

      // Find the default view or use the first view
      const defaultView = views?.find(view => view.is_default) || views?.[0] || null;

      set({ 
        views: views || [], 
        currentView: defaultView,
        loading: false 
      });
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  fetchTasks: async (projectId) => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) throw error;

      set({ tasks: tasks || [], loading: false });
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  createProject: async (title: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get user's workspaces
      const { data: workspaces, error: workspaceError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.user.id)
        .order('joined_at', { ascending: true })
        .limit(1);

      if (workspaceError) throw workspaceError;
      if (!workspaces || workspaces.length === 0) throw new Error('No workspace found');

      const workspace_id = workspaces[0].workspace_id;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          workspace_id,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Create default table view with columns
      const { data: view, error: viewError } = await supabase
        .from('project_views')
        .insert({
          project_id: data.id,
          title: 'Main Table',
          type: 'table',
          is_default: true,
          config: {
            columns: [
              {
                id: 'title',
                title: 'Title',
                type: 'text',
                width: 300
              },
              {
                id: 'status',
                title: 'Status',
                type: 'status',
                width: 150
              },
              {
                id: 'assignee',
                title: 'Assignee',
                type: 'user',
                width: 150
              },
              {
                id: 'due_date',
                title: 'Due Date',
                type: 'date',
                width: 150
              }
            ]
          }
        })
        .select()
        .single();

      if (viewError) throw viewError;

      set((state) => ({
        projects: [...state.projects, data],
        currentProject: data,
        views: [view],
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      console.error('Project creation error:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  updateProject: async (id, data) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
        currentProject:
          state.currentProject?.id === id
            ? { ...state.currentProject, ...data }
            : state.currentProject,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteProject: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      // Call the database function to handle deletion
      const { error } = await supabase
        .rpc('delete_project', {
          project_id: projectId
        });

      if (error) throw error;

      // Update local state
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        views: state.currentProject?.id === projectId ? [] : state.views,
        loading: false
      }));

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  setDefaultView: async (projectId, viewId) => {
    try {
      // First, unset any existing default view
      const { data: views, error } = await supabase
        .from('project_views')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;

      // Update all views in a transaction
      const { error: updateError } = await supabase.rpc('set_default_view', {
        p_project_id: projectId,
        p_view_id: viewId,
      });

      if (updateError) throw updateError;

      set((state) => ({
        views: state.views.map((v) => ({
          ...v,
          is_default: v.id === viewId,
        })),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateView: async (viewId, data) => {
    try {
      const { error } = await supabase
        .from('project_views')
        .update(data)
        .eq('id', viewId);

      if (error) throw error;

      set((state) => ({
        views: state.views.map((v) => (v.id === viewId ? { ...v, ...data } : v)),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteView: async (viewId) => {
    try {
      const { error } = await supabase
        .from('project_views')
        .delete()
        .eq('id', viewId);

      if (error) throw error;

      set((state) => ({
        views: state.views.filter((v) => v.id !== viewId),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  createView: async (projectId, title, type) => {
    try {
      const { data: view, error } = await supabase
        .from('project_views')
        .insert({
          project_id: projectId,
          title,
          type,
          config: {
            columns: type === 'table' ? [
              {
                id: 'title',
                title: 'Title',
                type: 'text',
                width: 300
              },
              {
                id: 'status',
                title: 'Status',
                type: 'status',
                width: 150
              },
              {
                id: 'assignee',
                title: 'Assignee',
                type: 'user',
                width: 150
              },
              {
                id: 'due_date',
                title: 'Due Date',
                type: 'date',
                width: 150
              }
            ] : []
          }
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        views: [...state.views, view]
      }));

      return view;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
}));