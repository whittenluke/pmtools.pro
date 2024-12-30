'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { ProjectCard } from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateProjectButton } from './CreateProjectButton';
import type { Database } from '@/lib/database.types';

type Tables = Database['public']['Tables'];
type Project = Omit<Tables['projects']['Row'], 'settings'> & {
  settings: Record<string, any>;
};

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
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Get workspace IDs for the user
        const { data: workspaces, error: workspaceError } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id);

        if (workspaceError) throw workspaceError;
        if (!workspaces) {
          setProjects([]);
          setLoading(false);
          return;
        }

        // Get projects for these workspaces
        const { data: projects, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .in('workspace_id', workspaces.map(w => w.workspace_id))
          .order('created_at', { ascending: false });

        if (projectError) throw projectError;
        if (!projects) {
          setProjects([]);
          setLoading(false);
          return;
        }

        const transformedProjects = projects.map(project => ({
          ...project,
          settings: typeof project.settings === 'string'
            ? JSON.parse(project.settings)
            : project.settings || {}
        }));

        setProjects(transformedProjects);
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