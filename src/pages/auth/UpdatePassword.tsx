import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';

export function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the access_token from the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    if (type === 'recovery' && accessToken) {
      // Set the session using the recovery tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      });
    } else {
      // If no recovery token, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Password updated successfully
    navigate('/account/dashboard', { 
      replace: true,
      state: { message: 'Password updated successfully' }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Choose a new password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md p-4 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                           dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
                         text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                         dark:bg-indigo-500 dark:hover:bg-indigo-600
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                         dark:focus:ring-offset-gray-900 disabled:opacity-50"
              >
                {loading ? 'Updating password...' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 