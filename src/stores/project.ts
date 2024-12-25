import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];
type View = Database['public']['Tables']['project_views']['Row'];

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  views: View[];
  loading: boolean;
  error: Error | null;
  setCurrentProject: (project: Project | null) => void;
  fetchProject: (id: string) => Promise<void>;
  fetchViews: (projectId: string) => Promise<void>;
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
  views: [],
  loading: true,
  error: null,

  setCurrentProject: (project) => set({ currentProject: project }),

  fetchProject: async (id) => {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ currentProject: project });
    } catch (error) {
      set({ error: error as Error });
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

      set({ views: views || [] });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  createProject: async (title, description) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Create default table view
      const { error: viewError } = await supabase
        .from('project_views')
        .insert({
          project_id: data.id,
          title: 'Table View',
          type: 'table',
          is_default: true,
        });

      if (viewError) throw viewError;

      set((state) => ({
        projects: [...state.projects, data],
        currentProject: data,
      }));

      return data;
    } catch (error) {
      set({ error: error as Error });
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

  deleteProject: async (id) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
      }));
    } catch (error) {
      set({ error: error as Error });
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
}));