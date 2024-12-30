'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function Account() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn(error);
      }

      if (profile) {
        setFullName(profile.full_name);
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const updateProfile = async ({
    fullName,
    avatarUrl,
  }: {
    fullName: string | null;
    avatarUrl: string | null;
  }) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No user');

      const newProfile = {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .upsert(newProfile)
        .select()
        .single();

      if (insertError) throw insertError;

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No user');

      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
      await updateProfile({ fullName, avatarUrl: data.publicUrl });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-screen-sm mx-auto py-8">
      <div className="space-y-8">
        <div className="flex items-center gap-8">
          <div>
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback>
                {fullName?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <Label htmlFor="avatar" className="cursor-pointer">
              {uploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              ) : (
                'Upload avatar'
              )}
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName || ''}
              onChange={(e) => setFullName(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div>
            <Button
              onClick={() => updateProfile({ fullName, avatarUrl })}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Update Profile'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 