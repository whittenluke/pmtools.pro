import React from 'react';
import { TimelineRow } from './TimelineRow';
import type { Task } from '@/types/database';

interface TimelineGridProps {
  tasks: Task[];
  columnWidth?: number;
  visibleDates?: Date[];
}

export function TimelineGrid({ tasks, columnWidth = 60, visibleDates = [] }: TimelineGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TimelineRow 
          key={task.id} 
          task={task} 
          columnWidth={columnWidth}
          visibleDates={visibleDates}
        />
      ))}
    </div>
  );
}