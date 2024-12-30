'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') ?? '/projects';

      if (code) {
        try {
          let currentSession = await supabase.auth.getSession();
          
          if (currentSession.error) {
            throw currentSession.error;
          }

          // If no session, exchange code for session
          if (!currentSession.data.session) {
            const { data: { session: newSession }, error: signInError } = 
              await supabase.auth.exchangeCodeForSession(code);
            if (signInError) {
              throw signInError;
            }
            currentSession = { data: { session: newSession }, error: null };
          }

          // Use window.location.href for a full page redirect
          window.location.href = next;
        } catch (error) {
          console.error('Error during auth callback:', error);
          window.location.href = '/login?error=Unable to sign in';
        }
      }
    };

    handleCallback();
  }, [searchParams]);

  return null;
} 