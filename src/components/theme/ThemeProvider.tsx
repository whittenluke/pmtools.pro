import { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useSupabase } from '../../lib/supabase/supabase-context';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const { supabase } = useSupabase();

  // Apply theme class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Sync with Supabase when user changes theme
  useEffect(() => {
    const syncTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({ theme_preference: theme })
          .eq('id', user.id);
      }
    };
    syncTheme();
  }, [theme, supabase]);

  return <>{children}</>;
} 