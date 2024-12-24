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
  clearError: () => void;
}

// Get the base URL for auth redirects
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8889';
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,
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
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const baseUrl = getBaseUrl();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${baseUrl}/auth/callback`,
          data: {
            email_confirmed: false,
          }
        }
      });
      if (error) throw error;
      
      // Don't set the user until email is verified
      if (data.user?.identities?.length === 0) {
        const error = new Error('An account with this email already exists') as AuthError;
        error.status = 409;
        throw error;
      }
    } catch (error: any) {
      const authError = error as AuthError;
      set({ error: authError });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signInWithProvider: async (provider: Provider) => {
    set({ loading: true, error: null });
    try {
      const baseUrl = getBaseUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
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
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const baseUrl = getBaseUrl();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      set({ error: error as AuthError });
      throw error;
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
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  clearError: () => set({ error: null }),
}));