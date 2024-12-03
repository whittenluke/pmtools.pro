import { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';

interface SupabaseContextType {
  supabase: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextType>({ supabase });

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => (
  <SupabaseContext.Provider value={{ supabase }}>
    {children}
  </SupabaseContext.Provider>
);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}; 