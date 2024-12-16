'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code and redirect path from URL
        const code = searchParams.get('code');
        const next = searchParams.get('next') || '/projects';
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');

        // Handle errors
        if (error) {
          console.error('Auth error:', error, error_description);
          router.push(`/login?error=${error}`);
          return;
        }

        // Handle auth code
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // Get the current session to confirm authentication
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Successfully authenticated, redirect to intended destination
            router.push(next);
          } else {
            throw new Error('No session established after code exchange');
          }
        } else {
          // No code found, redirect to login
          router.push('/login?error=no-code');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/login?error=auth');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="mt-4 text-lg font-semibold">Completing authentication...</h2>
        <p className="mt-2 text-muted-foreground">You will be redirected shortly.</p>
      </div>
    </div>
  );
} 