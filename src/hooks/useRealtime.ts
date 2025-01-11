import { useEffect } from 'react';
import { useRealtimeStore } from '@/stores/realtime';

export function useRealtime(projectId: string | undefined) {
  const { subscribeToProject, unsubscribeFromProject } = useRealtimeStore();

  useEffect(() => {
    if (!projectId) return;

    // Set up subscriptions
    subscribeToProject(projectId);

    // Cleanup on unmount or projectId change
    return () => {
      unsubscribeFromProject(projectId);
    };
  }, [projectId, subscribeToProject, unsubscribeFromProject]);
} 