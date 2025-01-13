import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface WorkspaceMember {
  user_id: string;
  role: string;
  profile?: Profile;
}

export function useWorkspaceMembers(workspaceId: string) {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Get current user's profile
        const { data: currentUserProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', user?.id)
          .single();

        if (profileError) throw profileError;

        // Get workspace members and their profiles separately since there's no FK relationship
        const { data: workspaceMembers, error: workspaceMembersError } = await supabase
          .from('workspace_members')
          .select('user_id, role')
          .eq('workspace_id', workspaceId);

        if (workspaceMembersError) throw workspaceMembersError;

        // Get profiles for all workspace members
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', workspaceMembers.map(member => member.user_id));

        if (profilesError) throw profilesError;

        // Transform the data to match our interface
        const transformedMembers = (workspaceMembers || []).map(member => ({
          user_id: member.user_id,
          role: member.role,
          profile: profiles?.find(p => p.id === member.user_id)
        }));

        // Add current user if not already in the list
        const currentUserInList = transformedMembers.some(member => member.user_id === user?.id);
        if (!currentUserInList && user) {
          transformedMembers.unshift({
            user_id: user.id,
            role: 'member',
            profile: currentUserProfile
          });
        }

        setMembers(transformedMembers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch members'));
        console.error('Error fetching members:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (workspaceId) {
      fetchMembers();
    }
  }, [workspaceId]);

  return { members, isLoading, error };
} 