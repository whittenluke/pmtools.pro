'use client';

import { useView } from '@/providers/ViewProvider';
import { Button } from '@/components/ui/button';

const views = [
  { id: 'table' as const, label: 'Table', icon: '📋' },
  { id: 'kanban' as const, label: 'Kanban', icon: '📊' },
  { id: 'timeline' as const, label: 'Timeline', icon: '📅' },
  { id: 'calendar' as const, label: 'Calendar', icon: '📆' },
] as const;

export function ViewSelector() {
  const { currentView, setView } = useView();

  return (
    <div className="flex gap-2">
      {views.map((view) => (
        <Button
          key={view.id}
          variant={currentView === view.id ? 'default' : 'outline'}
          onClick={() => setView(view.id)}
          className="flex items-center gap-2"
        >
          <span>{view.icon}</span>
          <span>{view.label}</span>
        </Button>
      ))}
    </div>
  );
}