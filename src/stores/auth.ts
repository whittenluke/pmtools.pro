import { create } from 'zustand';
import type { User, Provider } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthError extends Error {
  status?: number;
  code?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  initialized: boolean;
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

// Track the auth subscription
let authSubscription: { subscription: { unsubscribe: () => void } } | null = null;

export const useAuthStore = create<AuthState>()((set, get) => {
  // Initialize auth state
  const initializeAuth = async () => {
    if (typeof window === 'undefined') return;

    // Clean up previous subscription if it exists
    if (authSubscription) {
      authSubscription.subscription.unsubscribe();
      authSubscription = null;
    }

    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    set({ 
      user: session?.user ?? null,
      initialized: true,
      loading: false 
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      set({ 
        user: session?.user ?? null,
        loading: false 
      });
    });

    authSubscription = { subscription };
  };

  // Initialize on store creation
  if (typeof window !== 'undefined') {
    initializeAuth();
  }

  return {
    user: null,
    loading: true,
    error: null,
    initialized: false,
    signIn: async (email: string, password: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        set({ user: data.user });
        
        // Redirect to projects page
        if (typeof window !== 'undefined') {
          window.location.href = '/projects';
        }
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
      const state = get();
      if (state.loading || !state.initialized) return;

      set({ loading: true, error: null });
      try {
        // Clean up subscription first
        if (authSubscription) {
          authSubscription.subscription.unsubscribe();
          authSubscription = null;
        }

        // Then sign out of Supabase
        await supabase.auth.signOut();

        // Clear state
        set({ 
          user: null, 
          loading: false, 
          error: null,
          initialized: true
        });

        // Navigate
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } catch (error) {
        // On error, try to get current state
        const { data: { session } } = await supabase.auth.getSession();
        
        // Reinitialize auth
        if (session) {
          await initializeAuth();
        } else {
          set({ 
            user: null,
            error: error as AuthError,
            loading: false,
            initialized: true
          });
        }
        
        throw error;
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
  };
});