import { create } from 'zustand';
import type { Project, ProjectState, Task } from '@/types';

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  loading: false,
  tasks: [],
  createProject: async (project) => {
    // TODO: Implement project creation with Supabase
    const newProject: Project = {
      id: Math.random().toString(),
      ...project,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
}));