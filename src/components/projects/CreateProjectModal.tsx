'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/project';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Globe, Lock, Users, Briefcase, DollarSign, UserCircle2, Target, PenTool, Users2, CheckCircle2 } from 'lucide-react';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

type ProjectType = 'items' | 'budgets' | 'employees' | 'campaigns' | 'leads' | 'projects' | 'creatives' | 'clients' | 'tasks' | 'custom';
type PrivacyType = 'main' | 'private' | 'shareable';

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<PrivacyType>('main');
  const [type, setType] = useState<ProjectType>('items');
  
  const router = useRouter();
  const { createProject } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const project = await createProject(title);
      onClose();
      router.push(`/projects/${project.id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const projectTypes = [
    { id: 'items' as const, label: 'Items', icon: CheckCircle2 },
    { id: 'budgets' as const, label: 'Budgets', icon: DollarSign },
    { id: 'employees' as const, label: 'Employees', icon: UserCircle2 },
    { id: 'campaigns' as const, label: 'Campaigns', icon: Target },
    { id: 'leads' as const, label: 'Leads', icon: Users },
    { id: 'projects' as const, label: 'Projects', icon: Briefcase },
    { id: 'creatives' as const, label: 'Creatives', icon: PenTool },
    { id: 'clients' as const, label: 'Clients', icon: Users2 },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckCircle2 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Board name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              placeholder="New Board"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Privacy</Label>
            <RadioGroup
              value={privacy}
              onValueChange={(value) => setPrivacy(value as PrivacyType)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="main"
                  id="main"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="main"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Globe className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Main</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="private"
                  id="private"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="private"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Lock className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Private</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="shareable"
                  id="shareable"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="shareable"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Users className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Shareable</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Select what you're managing in this board</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as ProjectType)}
              className="grid grid-cols-3 gap-4"
            >
              {projectTypes.map((projectType) => (
                <div key={projectType.id}>
                  <RadioGroupItem
                    value={projectType.id}
                    id={projectType.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={projectType.id}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <projectType.icon className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">{projectType.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !title.trim()}
            >
              {loading ? 'Creating...' : 'Create Board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}