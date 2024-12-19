'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

export default function AccountPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClientComponentClient();

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Initialize profile with OAuth data if it's a new profile
      setProfile({
        id: user.id,
        full_name: data?.full_name || user.user_metadata?.full_name || '',
        avatar_url: data?.avatar_url || user.user_metadata?.avatar_url || null,
        updated_at: data?.updated_at || null
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !profile) return;

    setSaving(true);
    setError(null);

    try {
      const updates = {
        id: user.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, {
          onConflict: 'id'
        });

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access your account.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={user.email || ''}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="full_name"
            value={profile?.full_name || ''}
            onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
            placeholder="Enter your full name"
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
} 