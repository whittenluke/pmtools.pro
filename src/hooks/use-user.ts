import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import type { Profile } from '@/types';

export function useUser(userId: string | null) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .single();

        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  return { user, loading };
} 