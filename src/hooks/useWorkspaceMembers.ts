import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, WorkspaceMember, Json } from '@/types/database';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type WorkspaceMemberRow = Tables['workspace_members']['Row'];
type ProfileRow = Tables['profiles']['Row'];

const defaultProfile: Profile = {
  id: '',
  full_name: '',
  avatar_url: null,
  bio: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function useWorkspaceMembers(workspaceId: string) {
  const [data, setData] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setIsLoading(true);
        const { data: workspaceMembers, error: membersError } = await supabase
          .from('workspace_members')
          .select('*')
          .eq('workspace_id', workspaceId)
          .returns<WorkspaceMemberRow[]>();

        if (membersError) throw membersError;
        if (!workspaceMembers?.length) {
          setData([]);
          return;
        }

        const userIds = workspaceMembers.map(m => m.user_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds)
          .returns<ProfileRow[]>();

        if (profilesError) throw profilesError;

        const transformedMembers: WorkspaceMember[] = workspaceMembers.map(member => {
          const profile = profiles?.find(p => p.id === member.user_id) || defaultProfile;
          
          return {
            user_id: member.user_id,
            workspace_id: member.workspace_id,
            joined_at: member.joined_at,
            permissions: member.permissions as Json,
            role: member.role,
            profile: {
              ...profile,
              full_name: profile.full_name || '',
              avatar_url: profile.avatar_url || null,
              bio: profile.bio || null
            }
          };
        });

        setData(transformedMembers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [workspaceId]);

  return { data, isLoading, error };
} 