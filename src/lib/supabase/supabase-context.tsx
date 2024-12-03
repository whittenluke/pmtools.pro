import { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';

const SupabaseContext = createContext<{ supabase: SupabaseClient }>({ supabase });

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => (
  <SupabaseContext.Provider value={{ supabase }}>
    {children}
  </SupabaseContext.Provider>
);

export const useSupabase = () => useContext(SupabaseContext); 