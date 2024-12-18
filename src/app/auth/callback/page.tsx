'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('Auth error:', error, errorDescription);
      router.push(`/auth/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
      return;
    }

    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error('Session error:', sessionError);
        router.push('/auth/login?error=Session failed');
        return;
      }

      if (session) {
        router.push('/projects');
      } else {
        router.push('/auth/login?error=No session found');
      }
    });
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
} 