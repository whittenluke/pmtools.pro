import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { WorkspaceMember, Profile } from '@/types/database';

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
        profile:profiles!workspace_members_user_id_fkey (
          id,
          full_name,
          avatar_url,
          email
        )
      `)
      .eq('workspace_id', workspaceId);

    if (error) {
      throw error;
    }

    set({
      members: members.map((member) => ({
        user_id: member.user_id,
        role: member.role,
        profile: member.profile as Profile,
        full_name: member.profile?.full_name,
        avatar_url: member.profile?.avatar_url
      })),
    });
  },
})); 