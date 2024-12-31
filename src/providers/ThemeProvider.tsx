'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) return;

    // Subscribe to profile changes to sync theme across tabs/devices
    const channel = supabase
      .channel('profile-theme')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          const newTheme = payload.new?.settings?.theme;
          if (newTheme) {
            // next-themes will handle the actual theme change
            document.documentElement.setAttribute('data-theme', newTheme);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
} 