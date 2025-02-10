import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { WorkspaceMember, Profile, DbWorkspaceMember, DbProfile } from '@/types/database';

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      // Fetch workspace members
      const { data: workspaceMembers, error: membersError } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId);

      if (membersError) throw membersError;
      if (!workspaceMembers) return [];

      // Fetch profiles for all members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', workspaceMembers.map(member => member.user_id));

      if (profilesError) throw profilesError;

      // Get current user's email from auth
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Transform the data to include profiles
      const transformedMembers = workspaceMembers.map((member: DbWorkspaceMember) => {
        const profile = profiles?.find(p => p.id === member.user_id) as DbProfile | undefined;
        
        const defaultProfile: Profile = {
          id: member.user_id,
          full_name: 'Unknown User',
          avatar_url: null,
          bio: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const memberProfile: Profile = profile ? {
          ...profile,
          avatar_url: profile.avatar_url || null,
          bio: profile.bio || null
        } : defaultProfile;

        const transformedMember: WorkspaceMember = {
          ...member,
          joined_at: member.joined_at || new Date().toISOString(),
          permissions: member.permissions || {},
          profile: memberProfile
        };

        // Only include email for the current user
        if (currentUser && currentUser.id === member.user_id) {
          transformedMember.email = currentUser.email;
        }

        return transformedMember;
      });

      return transformedMembers;
    }
  });
} 