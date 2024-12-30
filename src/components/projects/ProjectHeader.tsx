'use client';

import { useProjectStore } from '@/stores/project';
import { Button } from '@/components/ui/button';
import { Share2, Settings, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProjectHeader() {
  const { currentProject, deleteProject } = useProjectStore();
  const router = useRouter();

  if (!currentProject) return null;

  const handleDelete = async () => {
    try {
      await deleteProject(currentProject.id);
      router.push('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="h-[57px] bg-card flex items-center px-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-medium text-foreground truncate">
          {currentProject.title}
        </h1>
        {currentProject.description && (
          <p className="text-sm text-muted-foreground truncate">
            {currentProject.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="sm" className="h-8">
          <Share2 className="h-4 w-4 mr-1.5" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <Settings className="h-4 w-4 mr-1.5" />
          Settings
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{currentProject.title}" and all of its data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}