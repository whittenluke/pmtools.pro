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

// Helper to get the correct redirect URL based on environment
const getRedirectUrl = (path: string) => {
  // Check if we're in Netlify dev environment
  const isNetlifyDev = process.env.NETLIFY_DEV === 'true';
  const port = isNetlifyDev ? '8888' : '3000';
  
  if (typeof window !== 'undefined') {
    const baseUrl = window.location.origin;
    // If we're already on the production domain, use it
    if (!baseUrl.includes('localhost')) {
      return `${baseUrl}${path}`;
    }
    // Otherwise, use the correct localhost port
    return `http://localhost:${port}${path}`;
  }
  // Fallback for SSR
  return path;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,
  initialize: async () => {
    set({ loading: true, error: null });
    try {
      // Get initial session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      set({ user: session?.user ?? null });
      
      // Setup auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        set({ user: session?.user ?? null });

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            // Redirect to dashboard or saved redirect URL
            window.location.href = '/projects';
            break;
          case 'SIGNED_OUT':
            // Clear any user data and redirect to login
            set({ user: null });
            window.location.href = '/login';
            break;
          case 'USER_UPDATED':
            // Refresh the user data
            set({ user: session?.user ?? null });
            break;
          case 'PASSWORD_RECOVERY':
            // Handle password recovery
            window.location.href = '/auth/reset-password';
            break;
        }
      });

      // Store cleanup function
      const cleanup = () => {
        subscription.unsubscribe();
      };

      // Return void to satisfy the Promise<void> return type
      cleanup();
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
      // Enhance error messages for better UX
      if (error.message?.includes('Invalid login')) {
        authError.message = 'Invalid email or password. Please try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        authError.message = 'Please verify your email address before signing in.';
      }
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
          emailRedirectTo: getRedirectUrl('/auth/callback'),
        },
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error: any) {
      const authError = error as AuthError;
      // Enhance error messages for better UX
      if (error.message?.includes('User already registered')) {
        authError.message = 'An account with this email already exists. Please sign in instead.';
      }
      set({ error: authError });
    } finally {
      set({ loading: false });
    }
  },
  signInWithProvider: async (provider: Provider) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getRedirectUrl('/auth/callback'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: provider === 'github' ? 'read:user user:email' :
                 provider === 'google' ? 'profile email' :
                 provider === 'azure' ? 'openid profile email' : '',
        },
      });

      if (error) throw error;
      
      // Check if we got a valid session
      if (!data.url) {
        throw new Error('No OAuth URL returned');
      }

      // Redirect to the OAuth provider
      window.location.href = data.url;
    } catch (error: any) {
      const authError = error as AuthError;
      // Enhance error messages for better UX
      if (error.message?.includes('popup_closed_by_user')) {
        authError.message = 'Authentication cancelled. Please try again.';
      }
      set({ error: authError });
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
        redirectTo: getRedirectUrl('/auth/reset-password'),
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