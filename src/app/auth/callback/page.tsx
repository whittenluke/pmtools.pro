'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') ?? '/projects';

      if (code) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            throw sessionError;
          }

          if (!session) {
            const { error: signInError } = await supabase.auth.exchangeCodeForSession(code);
            if (signInError) {
              throw signInError;
            }
          }

          router.push(next);
        } catch (error) {
          console.error('Error during auth callback:', error);
          router.push('/login?error=Unable to sign in');
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return null;
} 