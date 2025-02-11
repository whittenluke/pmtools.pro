import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { WorkspaceMember, Profile, Json } from '@/types/database';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type WorkspaceMemberRow = Tables['workspace_members']['Row'];

interface WorkspaceStore {
  members: WorkspaceMember[];
  fetchMembers: (workspaceId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  members: [],
  fetchMembers: async (workspaceId: string) => {
    const { data: members, error } = await supabase
      .from('workspace_members')
      .select(`
        user_id,
        role,
        workspace_id,
        joined_at,
        permissions,
        profile:profiles!workspace_members_user_id_fkey (
          id,
          full_name,
          avatar_url,
          bio,
          created_at,
          updated_at
        )
      `)
      .eq('workspace_id', workspaceId)
      .returns<(WorkspaceMemberRow & { profile: Profile })[]>();

    if (error) {
      throw error;
    }

    if (!members) {
      set({ members: [] });
      return;
    }

    const transformedMembers: WorkspaceMember[] = members.map((member) => ({
      user_id: member.user_id,
      workspace_id: member.workspace_id,
      joined_at: member.joined_at,
      permissions: member.permissions as Json,
      role: member.role,
      profile: member.profile
    }));

    set({ members: transformedMembers });
  },
})); 