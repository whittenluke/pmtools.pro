'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { AuthChangeEvent } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
        return;
      }
      if (session) {
        console.log('Initial session found:', session.user.id);
        useAuthStore.setState({ user: session.user });
      } else {
        console.log('No initial session found');
        useAuthStore.setState({ user: null });
      }
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.id);
          useAuthStore.setState({ user: session?.user ?? null });
          break;

        case 'SIGNED_OUT':
          console.log('User signed out');
          useAuthStore.setState({ user: null });
          break;

        case 'TOKEN_REFRESHED':
          console.log('Token refreshed for user:', session?.user?.id);
          useAuthStore.setState({ user: session?.user ?? null });
          break;

        case 'USER_UPDATED':
          console.log('User updated:', session?.user?.id);
          useAuthStore.setState({ user: session?.user ?? null });
          break;

        case 'INITIAL_SESSION':
          console.log('Initial session:', session?.user?.id);
          useAuthStore.setState({ user: session?.user ?? null });
          break;
      }

      // Refresh the page to ensure middleware runs
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return children;
} 