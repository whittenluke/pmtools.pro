'use client';

import { useState } from 'react';
import { Check, ChevronDown, GripVertical, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
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
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings2, Plus, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { StatusConfig } from '@/types';

interface Status {
  id: string;
  title: string;
  color: string;
  position: number;
  type?: 'default' | 'custom';
}

interface StatusSettingsProps {
  config: StatusConfig;
  onChange: (config: StatusConfig) => void;
}

export function StatusSettings({ config, onChange }: StatusSettingsProps) {
  const [open, setOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [newStatusTitle, setNewStatusTitle] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#4CAF50');

  const handleAddStatus = () => {
    if (!newStatusTitle.trim()) return;

    const newStatus: Status = {
      id: crypto.randomUUID(),
      title: newStatusTitle.trim(),
      color: newStatusColor,
      position: config.statuses.length,
      type: 'custom',
    };

    onChange({
      ...config,
      statuses: [...config.statuses, newStatus],
    });

    setNewStatusTitle('');
    setNewStatusColor('#4CAF50');
  };

  const handleUpdateStatus = (status: Status, updates: Partial<Status>) => {
    onChange({
      ...config,
      statuses: config.statuses.map((s) =>
        s.id === status.id ? { ...s, ...updates } : s
      ),
    });
  };

  const handleDeleteStatus = (status: Status) => {
    // Don't allow deleting default statuses
    if (status.type === 'default') return;

    // Don't allow deleting the default status
    if (status.id === config.defaultStatusId) return;

    onChange({
      ...config,
      statuses: config.statuses.filter((s) => s.id !== status.id),
    });
  };

  const handleReorderStatus = (fromIndex: number, toIndex: number) => {
    const newStatuses = [...config.statuses];
    const [movedStatus] = newStatuses.splice(fromIndex, 1);
    newStatuses.splice(toIndex, 0, movedStatus);

    // Update positions
    const reorderedStatuses = newStatuses.map((status, index) => ({
      ...status,
      position: index,
    }));

    onChange({
      ...config,
      statuses: reorderedStatuses,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage Statuses
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Status Settings</DialogTitle>
          <DialogDescription>
            Customize project statuses and their appearance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Add new status */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="New status name"
              value={newStatusTitle}
              onChange={(e) => setNewStatusTitle(e.target.value)}
            />
            <Input
              type="color"
              value={newStatusColor}
              onChange={(e) => setNewStatusColor(e.target.value)}
              className="w-16 p-1 h-9"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddStatus}
              disabled={!newStatusTitle.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Status list */}
          <div className="space-y-2">
            {config.statuses.map((status, index) => (
              <div
                key={status.id}
                className="flex items-center gap-2 p-2 rounded-md border"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {editingStatus?.id === status.id ? (
                  <Input
                    value={editingStatus.title}
                    onChange={(e) =>
                      setEditingStatus({ ...editingStatus, title: e.target.value })
                    }
                    onBlur={() => {
                      handleUpdateStatus(status, { title: editingStatus.title });
                      setEditingStatus(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateStatus(status, { title: editingStatus.title });
                        setEditingStatus(null);
                      }
                      if (e.key === 'Escape') {
                        setEditingStatus(null);
                      }
                    }}
                    className="h-8"
                  />
                ) : (
                  <span
                    className="flex-1 cursor-pointer"
                    onClick={() => setEditingStatus(status)}
                  >
                    {status.title}
                  </span>
                )}
                <Input
                  type="color"
                  value={status.color}
                  onChange={(e) =>
                    handleUpdateStatus(status, { color: e.target.value })
                  }
                  className="w-12 p-1 h-8"
                />
                {status.type === 'custom' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Status</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this status? Tasks using
                          this status will need to be updated.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteStatus(status)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 