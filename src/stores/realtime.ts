import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useProjectStore } from './project';

interface RealtimeState {
  subscriptions: Map<string, () => void>;
  subscribeToProject: (projectId: string) => Promise<void>;
  unsubscribeFromProject: (projectId: string) => void;
  unsubscribeAll: () => void;
}

export const useRealtimeStore = create<RealtimeState>()((set, get) => ({
  subscriptions: new Map(),

  subscribeToProject: async (projectId: string) => {
    const existingUnsub = get().subscriptions.get(projectId);
    if (existingUnsub) return; // Already subscribed

    // Subscribe to tasks changes
    const taskChannel = supabase
      .channel(`project-tasks:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const projectStore = useProjectStore.getState();
          
          switch (payload.eventType) {
            case 'INSERT':
              projectStore.optimisticUpdateTask(payload.new.id, payload.new);
              break;
            case 'UPDATE':
              projectStore.optimisticUpdateTask(payload.new.id, payload.new);
              break;
            case 'DELETE':
              projectStore.removeTask(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Subscribe to view changes
    const viewChannel = supabase
      .channel(`project-views:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_views',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const projectStore = useProjectStore.getState();
          
          switch (payload.eventType) {
            case 'INSERT':
              projectStore.addView(payload.new);
              break;
            case 'UPDATE':
              projectStore.updateViewLocally(payload.new.id, payload.new);
              break;
            case 'DELETE':
              projectStore.removeView(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Store cleanup function
    const cleanup = () => {
      supabase.removeChannel(taskChannel);
      supabase.removeChannel(viewChannel);
    };

    get().subscriptions.set(projectId, cleanup);
  },

  unsubscribeFromProject: (projectId: string) => {
    const cleanup = get().subscriptions.get(projectId);
    if (cleanup) {
      cleanup();
      get().subscriptions.delete(projectId);
    }
  },

  unsubscribeAll: () => {
    const subscriptions = get().subscriptions;
    subscriptions.forEach((cleanup) => cleanup());
    subscriptions.clear();
  },
})); 