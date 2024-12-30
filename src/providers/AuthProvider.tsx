'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only refresh on auth state changes if we're not on an auth-related page
    const unsubscribe = useAuthStore.subscribe((state) => {
      const isAuthPath = ['/login', '/signup', '/auth/callback'].includes(pathname);
      if (!isAuthPath) {
        router.refresh();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router, pathname]);

  return children;
} 