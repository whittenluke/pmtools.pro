import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import type { WorkspaceMember } from '@/types';

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
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId);

    if (error) {
      throw error;
    }

    set({
      members: members.map((member) => ({
        ...member,
        full_name: member.profiles?.full_name || null,
        avatar_url: member.profiles?.avatar_url || null,
      })),
    });
  },
})); 