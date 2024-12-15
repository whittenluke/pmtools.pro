'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';

interface KanbanColumnProps {
  title: string;
  status: string;
  children: React.ReactNode;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (taskId: string) => void;
}

export function KanbanColumn({
  title,
  status,
  children,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onDrop(taskId);
  };

  return (
    <div
      className="flex-1 min-w-[320px] bg-gray-50 rounded-lg p-4"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">
              {React.Children.count(children)}
            </span>
          </div>
          <Button variant="ghost" size="sm">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}