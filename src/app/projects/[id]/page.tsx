'use client';

import { useEffect } from 'react';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectViews } from '@/components/projects/views/ProjectViews';
import { ViewProvider } from '@/providers/ViewProvider';
import { useProjectStore } from '@/stores/project';
import { useRealtime } from '@/hooks/useRealtime';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewSelector } from '@/components/projects/views/ViewSelector';

function LoadingState() {
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="h-[57px] bg-card border-b border-border">
        <div className="h-full px-6 flex items-center">
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96 mt-1" />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="h-[calc(100vh-140px)] w-full" />
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex flex-col flex-1 bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Project</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary hover:text-primary/80"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { 
    fetchProject, 
    fetchViews, 
    fetchTasks, 
    loading, 
    error, 
    currentProject, 
    views,
    setLoading 
  } = useProjectStore();

  // Set up real-time subscriptions
  useRealtime(params.id);

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      if (!mounted) return;
      
      setLoading(true);
      try {
        await fetchProject(params.id);
        if (mounted) {
          await Promise.all([
            fetchViews(params.id),
            fetchTasks(params.id)
          ]);
        }
      } catch (err) {
        console.error('Error loading project:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadProject();

    return () => {
      mounted = false;
    };
  }, [params.id, fetchProject, fetchViews, fetchTasks, setLoading]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!currentProject || !views.length) return <LoadingState />;

  return (
    <ViewProvider projectId={params.id}>
      <div className="flex flex-col flex-1 bg-background">
        <ProjectHeader />
        <div className="p-4 border-b">
          <ViewSelector />
        </div>
        <ProjectViews />
      </div>
    </ViewProvider>
  );
}