import React from 'react';
import { Github } from 'lucide-react';
import { signInWithGitHub } from '../../lib/supabase/auth';

interface GitHubButtonProps {
  isSignUp?: boolean;
}

export function GitHubButton({ isSignUp = false }: GitHubButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signInWithGitHub();
    // No need to handle setLoading(false) as we're redirecting
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      <Github className="h-5 w-5" />
      {loading ? 'Connecting...' : `${isSignUp ? 'Sign up' : 'Sign in'} with GitHub`}
    </button>
  );
} 