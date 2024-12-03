import { createClient } from '@supabase/supabase-js';

// Debug environment variables
const debugEnv = () => {
  console.group('Environment Variables Debug');
  console.log('App Environment:', import.meta.env.VITE_APP_ENV);
  console.log('Site URL:', import.meta.env.VITE_SITE_URL);
  console.log('Supabase URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
  console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.groupEnd();
};

debugEnv();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

export async function testConnection() {
  try {
    const { error } = await supabase.from('users').select('count');
    if (error) throw error;
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
}

// Test connection immediately
testConnection().then(success => {
  console.log('Initial Supabase connection test:', success ? 'successful' : 'failed');
}); 