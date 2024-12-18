'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub, FaMicrosoft } from 'react-icons/fa';
import type { Provider } from '@supabase/supabase-js';
import { Alert } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

export function SocialAuth() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialAuth = async (provider: Provider) => {
    setError(null);
    setLoading(provider);
    
    try {
      console.log('Starting OAuth flow with provider:', provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'login'
          }
        }
      });
      
      if (error) {
        console.error('OAuth error:', error);
        throw error;
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed. Please try again.');
      setLoading(null);
    }
  };

  const providers = [
    { id: 'google' as Provider, icon: FaGoogle, label: 'Google' },
    { id: 'github' as Provider, icon: FaGithub, label: 'GitHub' },
    { id: 'azure' as Provider, icon: FaMicrosoft, label: 'Microsoft' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {providers.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="outline"
            onClick={() => handleSocialAuth(id)}
            className="w-full"
            disabled={loading !== null}
          >
            {loading === id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              <>
                <Icon className="mr-2" />
                {label}
              </>
            )}
          </Button>
        ))}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
} 