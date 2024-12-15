'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreateProjectModal } from './CreateProjectModal';

export function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Create Project
      </Button>
      <CreateProjectModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}