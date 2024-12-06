import { create } from 'zustand';
import { useEffect } from 'react';

interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem('theme') as ThemeStore['theme']) || 'system',
  resolvedTheme: 'light',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    
    // Immediately update the theme when user changes it
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
    document.documentElement.classList.toggle('dark', isDark);
    set({ resolvedTheme: isDark ? 'dark' : 'light' });
  },
}));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      const theme = useThemeStore.getState().theme;
      // Only update based on system preference if theme is set to 'system'
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', isDark);
        useThemeStore.setState({ resolvedTheme: isDark ? 'dark' : 'light' });
      }
    };

    mediaQuery.addEventListener('change', updateTheme);
    updateTheme();

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return children;
} 