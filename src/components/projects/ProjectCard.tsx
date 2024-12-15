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
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{project.description}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {project.status}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm text-gray-500">
          <span>Updated {formatDistanceToNow(new Date(project.updated_at))} ago</span>
        </div>
      </div>
    </Link>
  );
}