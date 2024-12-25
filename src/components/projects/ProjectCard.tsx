import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link 
      href={`/projects/${project.id}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary/20 hover:shadow-sm transition-all"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
        {project.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center text-xs text-gray-500">
          <span>Updated {formatDistanceToNow(new Date(project.updated_at))} ago</span>
        </div>
      </div>
    </Link>
  );
}