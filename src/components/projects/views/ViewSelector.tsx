'use client';

import { useView } from '@/providers/ViewProvider';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectStore } from '@/stores/project';

const viewOptions = [
  { id: 'table' as const, label: 'Table', icon: '📋' },
  { id: 'kanban' as const, label: 'Kanban', icon: '📊' },
  { id: 'timeline' as const, label: 'Timeline', icon: '📅' },
  { id: 'calendar' as const, label: 'Calendar', icon: '📆' },
];

export function ViewSelector() {
  const { currentView, setView } = useView();
  const { views, createView } = useProjectStore();

  const handleAddView = async (type: string, label: string) => {
    try {
      if (!views[0]?.project_id) return; // Safety check
      const newView = await createView(views[0].project_id, label, type);
      if (newView) {
        setView(newView);
      }
    } catch (error) {
      console.error('Failed to create view:', error);
    }
  };

  return (
    <div className="flex gap-2">
      {views.map((view) => (
        <Button
          key={view.id}
          variant={currentView?.id === view.id ? 'default' : 'outline'}
          onClick={() => setView(view)}
          className="flex items-center gap-2"
        >
          <span>{viewOptions.find(v => v.id === view.type)?.icon}</span>
          <span>{view.title}</span>
        </Button>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {viewOptions.map((view) => (
            <DropdownMenuItem
              key={view.id}
              onClick={() => handleAddView(view.id, `${view.label} View`)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span>{view.icon}</span>
              <span>{view.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}