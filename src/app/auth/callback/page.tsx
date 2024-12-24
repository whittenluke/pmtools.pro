'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] Callback component mounted`);
    const handleCallback = async () => {
      console.log(`[${new Date().toISOString()}] Callback page loaded`);
      try {
        // Try URL search params first
        let accessToken = searchParams.get('access_token');
        let refreshToken = searchParams.get('refresh_token');

        // If not in search params, try hash
        if (!accessToken || !refreshToken) {
          console.log(`[${new Date().toISOString()}] Tokens not in search params, checking hash`);
          const hash = window.location.hash;
          console.log(`[${new Date().toISOString()}] Processing hash:`, hash);
          
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            accessToken = hashParams.get('access_token');
            refreshToken = hashParams.get('refresh_token');
          }
        }
        
        if (!accessToken || !refreshToken) {
          console.log(`[${new Date().toISOString()}] Missing tokens, checking session`);
          // Check if we already have a session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log(`[${new Date().toISOString()}] Found existing session, redirecting to projects`);
            router.replace('/projects');
            return;
          }
          
          console.log(`[${new Date().toISOString()}] No tokens or session found, redirecting to login`);
          router.replace('/login?error=invalid-verification');
          return;
        }

        console.log(`[${new Date().toISOString()}] Setting session with tokens`);
        // Exchange the tokens for a session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.log(`[${new Date().toISOString()}] Session error:`, sessionError);
          router.replace('/login?error=verification-failed');
          return;
        }

        console.log(`[${new Date().toISOString()}] Session set, redirecting to projects`);
        // Force navigation to projects to trigger middleware
        router.replace('/projects');
      } catch (error) {
        console.log(`[${new Date().toISOString()}] Verification error:`, error);
        router.replace('/login?error=verification-failed');
      }
    };

    handleCallback();
  }, [router, supabase, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="mt-4 text-lg font-semibold">Verifying your account...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we complete the verification process.</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="mt-4 text-lg font-semibold">Loading...</h2>
          <p className="mt-2 text-muted-foreground">Please wait while we load the verification page.</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
} 