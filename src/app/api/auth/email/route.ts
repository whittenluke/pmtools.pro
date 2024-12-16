import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AuthResponse, AuthTokenResponse } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { type, email } = await request.json();

    switch (type) {
      case 'reset_password': {
        // First, let Supabase handle the password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
        });
        
        if (error) throw error;

        // Send our custom email with the reset link
        await emailService.sendPasswordReset(
          email,
          `${request.nextUrl.origin}/auth/reset-password`
        );
        break;
      }
      
      case 'verify_email': {
        const password = request.headers.get('password');
        if (!password) {
          return NextResponse.json(
            { error: 'Password is required' },
            { status: 400 }
          );
        }

        // Let Supabase handle the signup
        const { data, error }: AuthResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
          },
        });
        
        if (error) {
          // Handle specific error cases
          if (error.message.includes('User already registered')) {
            return NextResponse.json(
              { error: 'An account with this email already exists' },
              { status: 409 }
            );
          }
          throw error;
        }

        // Send our custom verification email if the user needs to verify their email
        if (data?.user && !data.user.email_confirmed_at) {
          await emailService.sendVerification(
            email,
            `${request.nextUrl.origin}/auth/verify`
          );
        }

        return NextResponse.json({
          success: true,
          needsEmailVerification: !data?.user?.email_confirmed_at
        });
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send email' },
      { status: 500 }
    );
  }
} 