import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, Provider } from '@supabase/supabase-js';

interface AuthError extends Error {
  status?: number;
  code?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,
  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      set({ user: session?.user ?? null });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: error as AuthError });
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error: any) {
      const authError = error as AuthError;
      set({ error: authError });
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error: any) {
      const authError = error as AuthError;
      set({ error: authError });
    } finally {
      set({ loading: false });
    }
  },
  signInWithProvider: async (provider: Provider) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      const authError = error as AuthError;
      set({ error: authError });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: error as AuthError });
    } finally {
      set({ loading: false });
    }
  },
  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      set({ error: error as AuthError });
    } finally {
      set({ loading: false });
    }
  },
  updatePassword: async (password: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
    } catch (error) {
      set({ error: error as AuthError });
    } finally {
      set({ loading: false });
    }
  },
  clearError: () => set({ error: null }),
}));