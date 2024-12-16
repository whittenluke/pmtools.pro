import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (email: string, password: string) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set((state) => ({ ...state, user: data.user, error: null, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: error as Error, loading: false }));
    }
  },
  signOut: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      await supabase.auth.signOut();
      set((state) => ({ ...state, user: null, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: error as Error, loading: false }));
    }
  },
}));