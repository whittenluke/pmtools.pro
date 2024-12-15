'use client';

import { useProjectStore } from '@/stores/project';
import { Button } from '@/components/ui/button';
import { ViewSelector } from './views/ViewSelector';

export function ProjectHeader() {
  const { currentProject } = useProjectStore();

  if (!currentProject) return null;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentProject.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{currentProject.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <ViewSelector />
            <Button>Share</Button>
            <Button variant="outline">Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}