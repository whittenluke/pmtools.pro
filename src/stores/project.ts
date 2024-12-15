import { create } from 'zustand';
import type { Project, ProjectState, Task, ViewModel } from '@/types';

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  loading: false,
  tasks: [],
  views: [],
  currentView: null,
  createProject: async (project) => {
    // TODO: Implement project creation with Supabase
    const newProject: Project = {
      id: Math.random().toString(),
      ...project,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: '', // TODO: Get from auth context
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  updateProject: async (id, project) => {
    // TODO: Implement project update with Supabase
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...project, updated_at: new Date().toISOString() } : p
      ),
    }));
  },
  deleteProject: async (id) => {
    // TODO: Implement project deletion with Supabase
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.project_id !== id),
    }));
  },
  setCurrentProject: (project) => set({ currentProject: project }),
  createTask: async (task) => {
    // TODO: Implement task creation with Supabase
    const newTask: Task = {
      id: Math.random().toString(),
      ...task,
      status: 'todo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignee_id: null,
      start_date: null,
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  updateTask: async (id, task) => {
    // TODO: Implement task update with Supabase
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...task, updated_at: new Date().toISOString() } : t
      ),
    }));
  },
  deleteTask: async (id) => {
    // TODO: Implement task deletion with Supabase
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
  setCurrentView: (view) => set({ currentView: view }),
  updateView: async (id, view) => {
    // TODO: Implement view update with Supabase
    set((state) => ({
      views: state.views.map((v) =>
        v.id === id ? { ...v, ...view } : v
      ),
    }));
  },
}));