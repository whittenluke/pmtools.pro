import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  error: null 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
        
        if (session?.expires_at) {
          const expiresAt = new Date(session.expires_at * 1000);
          const now = new Date();
          const timeUntilExpiry = expiresAt.getTime() - now.getTime();
          
          if (timeUntilExpiry < 300000) {
            const { data: { session: newSession }, error: refreshError } = 
              await supabase.auth.refreshSession();
            if (refreshError) throw refreshError;
            if (mounted && newSession) {
              setUser(newSession.user);
            }
          }
        }
        
        if (accessToken && session?.user) {
          const returnTo = sessionStorage.getItem('returnTo');
          if (returnTo) {
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
            return;
          }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event: AuthChangeEvent, session: Session | null) => {
            if (!mounted) return;
            
            setUser(session?.user ?? null);
            setLoading(false);

            if (event === 'SIGNED_IN') {
              const returnTo = sessionStorage.getItem('returnTo');
              if (returnTo) {
                sessionStorage.removeItem('returnTo');
                navigate(returnTo, { replace: true });
              } else {
                navigate('/account/dashboard', { replace: true });
              }
            }
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Authentication initialization failed'));
          setLoading(false);
        }
      }
    }

    initializeAuth();
  }, [navigate]);

  if (error) {
    console.error('Auth error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Authentication Error</h2>
            <p className="mt-2 text-sm text-gray-600">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 