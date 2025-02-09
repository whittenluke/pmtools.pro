import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

const redirectTo = process.env.NODE_ENV === 'development'
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

export const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options: {
    global: {
      headers: {
        'x-application-name': 'pmtools'
      }
    },
    realtime: {
      reconnect: true
    }
  }
});

export type SupabaseClient = typeof supabase;