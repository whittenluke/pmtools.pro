import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

const redirectTo = process.env.NODE_ENV === 'development'
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

export const supabase = createClientComponentClient<Database>({
  options: {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      redirectTo
    }
  }
});

export type SupabaseClient = typeof supabase;