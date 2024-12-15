'use client';

import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectViews } from '@/components/projects/views/ProjectViews';
import { ViewProvider } from '@/providers/ViewProvider';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <ViewProvider projectId={params.id}>
      <div className="min-h-screen bg-gray-50">
        <ProjectHeader />
        <ProjectViews />
      </div>
    </ViewProvider>
  );
}