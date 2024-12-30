'use client';

import { useProjectStore } from '@/stores/project';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Folder, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projects } = useProjectStore();
  const params = useParams();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex h-[calc(100vh-57px)] bg-background">
      {/* Fixed width container for layout stability */}
      <div className={cn("flex-shrink-0", isCollapsed ? "w-10" : "w-64")}>
        {/* Left Sidebar */}
        <div 
          className={cn(
            "fixed h-[calc(100vh-57px)] border-r border-border bg-card transition-all duration-300 ease-in-out group",
            isCollapsed ? "w-10" : "w-64",
            isCollapsed && isHovered && "w-64 shadow-lg z-50"
          )}
          onMouseEnter={() => isCollapsed && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Collapse Button */}
          <div 
            className={cn(
              "absolute right-0 top-0 w-10 h-[37px] flex items-center justify-center cursor-pointer z-50 rounded-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={() => {
              setIsHovered(false);
              setIsCollapsed(!isCollapsed);
            }}
          >
            <ChevronLeft 
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isCollapsed ? "rotate-180" : ""
              )}
            />
          </div>

          {/* Nav Content */}
          {(!isCollapsed || isHovered) && (
            <div className="flex flex-col h-full">
              <div className="h-[37px] flex items-center border-b border-border">
                <Link 
                  href="/projects"
                  className={cn(
                    "flex items-center px-6 text-sm font-medium hover:text-foreground",
                    !params.id ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <span>Projects</span>
                </Link>
              </div>

              <ScrollArea className="flex-1 px-3 py-2">
                <div className="mb-2">
                  <Button
                    onClick={() => router.push('/projects/new')}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground px-3"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="ml-2">New Project</span>
                  </Button>
                </div>

                <div className="space-y-1">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      title={project.title}
                    >
                      <div
                        className={cn(
                          'flex items-center px-2 py-1.5 text-sm transition-colors rounded-sm',
                          params.id === project.id
                            ? 'text-primary font-medium bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                        )}
                      >
                        <Folder className="h-4 w-4 shrink-0 opacity-70" />
                        <span className="truncate ml-2">{project.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 