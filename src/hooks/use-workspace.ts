import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Workspace } from '@/types';

export function useWorkspace(workspaceId: string) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', workspaceId)
          .single();

        if (error) throw error;
        setWorkspace(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    if (workspaceId) {
      fetchWorkspace();
    }
  }, [workspaceId]);

  return { workspace, loading, error };
}