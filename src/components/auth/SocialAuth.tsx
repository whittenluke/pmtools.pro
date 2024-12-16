'use client';

import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub, FaMicrosoft } from 'react-icons/fa';
import { useAuthStore } from '@/stores/auth';
import type { Provider } from '@supabase/supabase-js';

export function SocialAuth() {
  const { signInWithProvider, loading } = useAuthStore();

  const handleSocialAuth = async (provider: Provider) => {
    await signInWithProvider(provider);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <Button
        variant="outline"
        onClick={() => handleSocialAuth('google')}
        className="w-full"
        disabled={loading}
      >
        <FaGoogle className="mr-2" />
        Google
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialAuth('github')}
        className="w-full"
        disabled={loading}
      >
        <FaGithub className="mr-2" />
        GitHub
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialAuth('azure')}
        className="w-full"
        disabled={loading}
      >
        <FaMicrosoft className="mr-2" />
        Microsoft
      </Button>
    </div>
  );
} 