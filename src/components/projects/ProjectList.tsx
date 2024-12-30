'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateProjectButton } from './CreateProjectButton';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];
type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row'];

function ProjectSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="pt-4">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // First get the user's workspaces
        const { data: workspaces, error: workspaceError } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id);

        if (workspaceError) {
          console.error('Error fetching workspaces:', workspaceError);
          throw workspaceError;
        }

        if (!workspaces || workspaces.length === 0) {
          // If no workspace found, show empty state
          setProjects([]);
          setLoading(false);
          return;
        }

        // Get all workspace IDs
        const workspaceIds = workspaces.map(w => w.workspace_id);

        // Then get projects for all workspaces
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .in('workspace_id', workspaceIds)
          .order('created_at', { ascending: false });

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw projectsError;
        }

        setProjects(projects || []);
        setError(null);
      } catch (err) {
        console.error('Error in fetchProjects:', err);
        setError('Error Loading Projects: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Projects</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button 
          onClick={() => {
            setLoading(true);
            setError(null);
          }}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
        <p className="text-gray-500 mb-4">Create your first project to get started.</p>
        <CreateProjectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
        <CreateProjectButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}