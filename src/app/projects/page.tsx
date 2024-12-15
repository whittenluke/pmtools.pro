'use client';

import { ProjectList } from '@/components/projects/ProjectList';
import { CreateProjectButton } from '@/components/projects/CreateProjectButton';
import { ProjectFilters } from '@/components/projects/ProjectFilters';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProjectButton />
      </div>
      <ProjectFilters />
      <ProjectList />
    </div>
  );
}