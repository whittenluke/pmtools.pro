import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import type { Task, Project, ProjectView } from '@/types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentView: ProjectView | null;
  views: ProjectView[];
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  taskUpdates: Map<string, Task>; // Store original state for rollback
  
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
  // Real-time update handlers
  addView: (view: ProjectView) => void;
  updateViewLocally: (viewId: string, data: Partial<ProjectView>) => void;
  removeView: (viewId: string) => void;
  removeTask: (taskId: string) => void;
  // Task actions
  createTask: (task: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  optimisticUpdateTask: (id: string, update: Partial<Task>) => void;
  revertTaskUpdate: (id: string) => void;
  updateViewConfig: (viewId: string, config: Partial<ProjectView['config']>) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  currentProject: null,
  currentView: null,
  views: [],
  tasks: [],
  loading: true,
  error: null,
  taskUpdates: new Map(),

  setLoading: (loading) => set({ loading }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentView: (view) => set({ currentView: view }),

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get user's workspaces
      const { data: workspaces, error: workspaceError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.user.id);

      if (workspaceError) throw workspaceError;
      if (!workspaces || workspaces.length === 0) {
        set({ projects: [], loading: false });
        return;
      }

      const workspaceIds = workspaces.map(w => w.workspace_id);

      // Get all projects for these workspaces
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .in('workspace_id', workspaceIds)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      set({ projects: projects || [], loading: false });
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

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

  fetchViews: async (projectId: string) => {
    try {
      const { data: views, error } = await supabase
        .from('project_views')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;

      // Transform and type the views
      const typedViews: ProjectView[] = views.map(view => ({
        ...view,
        type: view.type as 'table' | 'kanban' | 'timeline' | 'calendar',
        columns: view.columns || [],
        config: view.config || {},
      }));

      set({ views: typedViews });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  fetchTasks: async (projectId) => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:project_id (
            workspace_id
          )
        `)
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) throw error;

      // Transform tasks to include workspace_id at top level
      const transformedTasks = tasks?.map(task => ({
        ...task,
        workspace_id: task.projects?.workspace_id
      })) || [];

      set({ tasks: transformedTasks, loading: false });
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
          ],
          config: {
            status_config: {
              statuses: [
                {
                  id: 'not_started',
                  title: 'Not Started',
                  color: '#E5E7EB',
                  position: 0,
                  type: 'default'
                },
                {
                  id: 'in_progress',
                  title: 'In Progress',
                  color: '#93C5FD',
                  position: 1,
                  type: 'default'
                },
                {
                  id: 'completed',
                  title: 'Completed',
                  color: '#86EFAC',
                  position: 2,
                  type: 'default'
                },
                {
                  id: 'blocked',
                  title: 'Blocked',
                  color: '#FCA5A5',
                  position: 3,
                  type: 'default'
                }
              ],
              defaultStatusId: 'not_started'
            }
          }
        })
        .select()
        .single();

      if (viewError) throw viewError;

      // Create default table
      const { data: table, error: tableError } = await supabase
        .from('tables')
        .insert({
          project_id: data.id,
          title: 'Main Table',
          position: 0,
          settings: {
            collapsed: false,
            style: {
              color: '#4CAF50',
              background: 'transparent'
            }
          }
        })
        .select()
        .single();

      if (tableError) throw tableError;

      // Create three default tasks in the table
      const defaultTasks = [
        {
          title: 'Plan project scope',
          description: 'Define the project goals, deliverables, and timeline',
          status_id: 'not_started',
          project_id: data.id,
          table_id: table.id,
          position: 0,
          column_values: {}
        },
        {
          title: 'Set up project resources',
          description: 'Gather necessary tools and resources for the project',
          status_id: 'not_started',
          project_id: data.id,
          table_id: table.id,
          position: 1,
          column_values: {}
        },
        {
          title: 'Schedule kickoff meeting',
          description: 'Organize initial team meeting to align on project goals',
          status_id: 'not_started',
          project_id: data.id,
          table_id: table.id,
          position: 2,
          column_values: {}
        }
      ];

      const { data: createdTasks, error: tasksError } = await supabase
        .from('tasks')
        .insert(defaultTasks)
        .select();

      if (tasksError) throw tasksError;

      set((state) => ({
        projects: [...state.projects, data],
        currentProject: data,
        views: [view],
        tasks: createdTasks,
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

  updateView: async (viewId: string, data: Partial<ProjectView>) => {
    try {
      // Ensure we're not sending undefined values to the database
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      ) as Partial<ProjectViewBase>;

      const { error } = await supabase
        .from('project_views')
        .update(cleanedData)
        .eq('id', viewId);

      if (error) throw error;

      set((state) => ({
        views: state.views.map((v) => 
          v.id === viewId 
            ? { ...v, ...data }
            : v
        ),
        currentView: state.currentView?.id === viewId 
          ? { ...state.currentView, ...data }
          : state.currentView,
      }));
    } catch (error) {
      console.error('Failed to update view:', error);
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

  createView: async (projectId: string, title: string, type: 'table' | 'kanban' | 'timeline' | 'calendar') => {
    try {
      const defaultStatusConfig = {
        statuses: [
          {
            id: 'not_started',
            title: 'Not Started',
            color: '#E5E7EB',
            position: 0,
            type: 'default'
          },
          {
            id: 'in_progress',
            title: 'In Progress',
            color: '#93C5FD',
            position: 1,
            type: 'default'
          },
          {
            id: 'completed',
            title: 'Completed',
            color: '#86EFAC',
            position: 2,
            type: 'default'
          },
          {
            id: 'blocked',
            title: 'Blocked',
            color: '#FCA5A5',
            position: 3,
            type: 'default'
          }
        ],
        defaultStatusId: 'not_started'
      };

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
            ] : [],
            status_config: type === 'table' ? defaultStatusConfig : undefined
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Transform and type the view
      const typedView: ProjectView = {
        ...view,
        type: view.type as 'table' | 'kanban' | 'timeline' | 'calendar',
        columns: view.columns || [],
        config: view.config || {}
      };

      set((state) => ({
        views: [...state.views, typedView]
      }));

      return typedView;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  optimisticUpdateTask: (taskId: string, data: Partial<Task>) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    
    if (task) {
      // Store original state for potential rollback
      state.taskUpdates.set(taskId, { ...task });
      
      // Update state optimistically, preserving workspace_id
      set({
        tasks: state.tasks.map(t =>
          t.id === taskId ? { ...t, ...data, workspace_id: t.workspace_id } : t
        )
      });
    }
  },

  revertTaskUpdate: (taskId: string) => {
    const state = get();
    const originalTask = state.taskUpdates.get(taskId);
    
    if (originalTask) {
      set({
        tasks: state.tasks.map(t =>
          t.id === taskId ? originalTask : t
        )
      });
      state.taskUpdates.delete(taskId);
    }
  },

  updateTask: async (taskId: string, data: Partial<Task>) => {
    try {
      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', taskId)
        .select(`
          *,
          projects:project_id (
            workspace_id
          )
        `)
        .single();

      if (error) throw error;

      // Transform task to include workspace_id at top level
      const transformedTask = {
        ...updatedTask,
        workspace_id: updatedTask.projects?.workspace_id
      };

      // Update the task in state
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? transformedTask : t)
      }));

      // Clear the stored original state on successful update
      get().taskUpdates.delete(taskId);
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert to original state on failure
      get().revertTaskUpdate(taskId);
      throw error;
    }
  },

  addView: (view: ProjectView) => {
    set((state) => ({
      views: [...state.views, view],
      // If this is the first view, set it as current
      currentView: state.views.length === 0 ? view : state.currentView,
    }));
  },

  updateViewLocally: (viewId: string, data: Partial<ProjectView>) => {
    set((state) => ({
      views: state.views.map((v) => (v.id === viewId ? { ...v, ...data } : v)),
      currentView:
        state.currentView?.id === viewId
          ? { ...state.currentView, ...data }
          : state.currentView,
    }));
  },

  removeView: (viewId: string) => {
    set((state) => {
      const newViews = state.views.filter((v) => v.id !== viewId);
      return {
        views: newViews,
        // If current view was removed, switch to first available view
        currentView:
          state.currentView?.id === viewId
            ? newViews[0] || null
            : state.currentView,
      };
    });
  },

  removeTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
      // Clean up any pending updates
      taskUpdates: (() => {
        state.taskUpdates.delete(taskId);
        return state.taskUpdates;
      })(),
    }));
  },

  createTask: async (task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select(`
        *,
        projects:project_id (
          workspace_id
        )
      `)
      .single();

    if (error) throw error;

    // Transform task to include workspace_id at top level
    const transformedTask = {
      ...data,
      workspace_id: data.projects?.workspace_id
    };

    set((state) => ({
      tasks: [...state.tasks, transformedTask],
    }));

    return transformedTask;
  },

  updateViewConfig: async (viewId: string, config: Partial<ProjectView['config']>) => {
    const { currentView } = get();
    if (!currentView) return;

    try {
      const updatedConfig = {
        ...currentView.config,
        ...config,
      };

      // Optimistically update the view config
      set({
        currentView: {
          ...currentView,
          config: updatedConfig,
        },
      });

      // Update in the database
      const { error } = await supabase
        .from('project_views')
        .update({
          config: updatedConfig,
        })
        .eq('id', viewId);

      if (error) throw error;
    } catch (error) {
      // Revert to the original state on error
      set({ currentView });
      throw error;
    }
  },
}));