import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link 
      href={`/projects/${project.id}`}
      className={cn(
        "block p-6 rounded-lg border transition-all",
        "bg-card hover:shadow-sm",
        "border-border hover:border-primary/20"
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">{project.title}</h3>
        {project.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Updated {formatDistanceToNow(new Date(project.updated_at))} ago</span>
        </div>
      </div>
    </Link>
  );
}