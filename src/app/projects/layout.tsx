'use client';

import { useProjectStore } from '@/stores/project';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams, useRouter } from 'next/navigation';
import { Folder, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projects } = useProjectStore();
  const params = useParams();
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-4 flex flex-col h-full">
          <Button
            onClick={() => router.push('/projects/new')}
            className="w-full mb-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>

          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                >
                  <div
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm transition-colors',
                      params.id === project.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Folder className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{project.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 