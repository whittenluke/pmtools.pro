'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ProjectFilters() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  return (
    <div className="flex gap-2 mb-6">
      <Button 
        variant={selectedStatus === null ? 'default' : 'outline'}
        onClick={() => setSelectedStatus(null)}
      >
        All
      </Button>
      <Button 
        variant={selectedStatus === 'active' ? 'default' : 'outline'}
        onClick={() => setSelectedStatus('active')}
      >
        Active
      </Button>
      <Button 
        variant={selectedStatus === 'completed' ? 'default' : 'outline'}
        onClick={() => setSelectedStatus('completed')}
      >
        Completed
      </Button>
      <Button 
        variant={selectedStatus === 'archived' ? 'default' : 'outline'}
        onClick={() => setSelectedStatus('archived')}
      >
        Archived
      </Button>
    </div>
  );
}