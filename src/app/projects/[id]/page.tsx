'use client';

import { useEffect } from 'react';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectViews } from '@/components/projects/views/ProjectViews';
import { ViewProvider } from '@/providers/ViewProvider';
import { useProjectStore } from '@/stores/project';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Project</h2>
        <p className="text-gray-500 mb-4">{error.message}</p>
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
  const { fetchProject, fetchViews, loading, error, currentProject, views } = useProjectStore();

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      if (!mounted) return;
      
      try {
        await fetchProject(params.id);
        if (mounted) {
          await fetchViews(params.id);
        }
      } catch (err) {
        console.error('Error loading project:', err);
      }
    };
    
    // Only load if we don't have the project or it's a different project
    if (!currentProject || currentProject.id !== params.id) {
      loadProject();
    }

    return () => {
      mounted = false;
    };
  }, [params.id]); // Only depend on the ID

  if (loading || !currentProject || views.length === 0) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <ViewProvider projectId={params.id}>
      <div className="min-h-screen bg-gray-50">
        <ProjectHeader />
        <ProjectViews />
      </div>
    </ViewProvider>
  );
}