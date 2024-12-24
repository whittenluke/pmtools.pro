'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  useEffect(() => {
    // Let the auth store handle initialization
    // We just need to refresh the router when auth state changes
    const unsubscribe = useAuthStore.subscribe((state) => {
      router.refresh();
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  return children;
} 