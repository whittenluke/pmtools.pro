import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskUpdate = Partial<Task>;

interface ProjectStore {
  updateTask: (taskId: string, update: TaskUpdate) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  updateTask: async (taskId: string, update: TaskUpdate) => {
    const { error } = await supabase
      .from('tasks')
      .update(update)
      .eq('id', taskId);

    if (error) {
      throw error;
    }
  },
})); 