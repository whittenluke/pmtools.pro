import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialize: async () => {
    set((state) => ({ ...state, loading: true }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set((state) => ({ ...state, user: session?.user ?? null, loading: false }));
      
      // Setup auth state listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set((state) => ({ ...state, user: session?.user ?? null }));
      });
    } catch (error) {
      set((state) => ({ ...state, error: error as Error, loading: false }));
    }
  },
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
  signUp: async (email: string, password: string) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signUp({
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