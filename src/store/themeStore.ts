import { create } from 'zustand';
import { useSupabase } from '../lib/supabase/supabase-context';
import { useEffect } from 'react';

interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system', userId?: string) => Promise<void>;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: (localStorage.getItem('theme-preference') as ThemeStore['theme']) || 'system',
  resolvedTheme: 'light',
  
  setTheme: async (theme, userId) => {
    set({ theme });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
    document.documentElement.classList.toggle('dark', isDark);
    set({ resolvedTheme: isDark ? 'dark' : 'light' });

    localStorage.setItem('theme-preference', theme);
    
    if (userId) {
      const { supabase } = useSupabase();
      await supabase
        .from('users')
        .update({ theme_preference: theme })
        .eq('id', userId);
    }
  },

  initializeTheme: () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme-preference') as ThemeStore['theme'];
    const currentTheme = get().theme;
    
    const theme = savedTheme || currentTheme;
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && mediaQuery.matches);

    document.documentElement.classList.toggle('dark', isDark);
    set({ 
      theme,
      resolvedTheme: isDark ? 'dark' : 'light' 
    });
  }
}));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase();
  
  useEffect(() => {
    // Initialize theme on mount
    useThemeStore.getState().initializeTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => useThemeStore.getState().initializeTheme();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync with Supabase when user logs in
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user.id) {
        const { data: userData } = await supabase
          .from('users')
          .select('theme_preference')
          .eq('id', session.user.id)
          .single();
        
        if (userData?.theme_preference) {
          useThemeStore.getState().setTheme(userData.theme_preference, session.user.id);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return children;
} 