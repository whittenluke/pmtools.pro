import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Workspace } from '@/types/database';

export function useWorkspace(workspaceId: string) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', workspaceId)
          .single();

        if (error) throw error;

        if (data) {
          const workspace: Workspace = {
            id: data.id,
            name: data.name,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
            settings: data.settings || null
          };
          setWorkspace(workspace);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
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