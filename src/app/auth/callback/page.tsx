'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function CallbackContent() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] Callback component mounted`);
    const handleCallback = async () => {
      console.log(`[${new Date().toISOString()}] Callback page loaded`);
      try {
        // Parse the URL hash
        const hash = window.location.hash;
        console.log(`[${new Date().toISOString()}] Processing hash:`, hash);
        
        const hashParams = hash.substring(1);
        const params = new URLSearchParams(hashParams);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (!accessToken || !refreshToken) {
          console.log(`[${new Date().toISOString()}] Missing tokens, redirecting to login`);
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
  }, [router, supabase]);

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