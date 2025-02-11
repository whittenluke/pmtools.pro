import React from 'react';
import { TimelineRow } from './TimelineRow';
import type { Task } from '@/types/database';

interface TimelineGridProps {
  tasks: Task[];
}

export function TimelineGrid({ tasks }: TimelineGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TimelineRow key={task.id} task={task} />
      ))}
    </div>
  );
}