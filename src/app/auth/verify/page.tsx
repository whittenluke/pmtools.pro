'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Get the code and redirect path from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        if (!token) {
          router.push('/login?error=invalid-verification');
          return;
        }

        if (type === 'recovery') {
          // Handle password reset verification
          const { error } = await supabase.auth.verifyOtp({
            email: email || '',
            token,
            type: 'recovery',
          });
          if (error) throw error;
          router.push('/auth/reset-password');
        } else {
          // Handle email verification
          const { error } = await supabase.auth.verifyOtp({
            email: email || '',
            token,
            type: 'email',
          });
          if (error) throw error;
          router.push('/login?message=email-verified');
        }
      } catch (error) {
        console.error('Verification error:', error);
        router.push('/login?error=verification-failed');
      }
    };

    handleVerification();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="mt-4 text-lg font-semibold">Verifying your email...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
} 