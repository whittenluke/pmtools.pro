import React, { useState } from 'react';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Task, WorkspaceMember } from '@/types/database';

interface PeopleCellProps {
  value: string | string[] | null;
  row: Task;
  workspaceId: string;
  onUpdate: (userIds: string[] | null) => Promise<void>;
  allowMultiple?: boolean;
}

export function PeopleCell({ value, row, workspaceId, onUpdate, allowMultiple = false }: PeopleCellProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const { data: members = [], isLoading } = useWorkspaceMembers(workspaceId);

  const selectedUsers = Array.isArray(value) ? 
    members.filter(member => value.includes(member.user_id)) :
    value ? [members.find(member => member.user_id === value)].filter(Boolean) : [];

  if (isLoading) {
    return (
      <div className="w-full h-8 animate-pulse bg-muted rounded" />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-center px-4 py-2"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="relative group flex items-center w-full justify-center">
            <div className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4" />
            </div>
            <div className="flex -space-x-2 transition-all group-hover:translate-x-2">
              {selectedUsers.length > 0 ? (
                selectedUsers.map((member) => member && (
                  <TooltipProvider key={member.user_id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-7 w-7 border-2 border-background">
                          <AvatarImage src={member.profile.avatar_url || ''} />
                          <AvatarFallback>
                            {member.profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-1">
                          <p className="font-medium">{member.profile.full_name || 'Unknown User'}</p>
                          {member.email && (
                            <p className="text-muted-foreground text-sm">{member.email}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-dashed border-muted flex items-center justify-center" />
              )}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="flex flex-col py-1">
          <button
            onClick={() => {
              onUpdate(null);
              setOpen(false);
            }}
            className="flex items-center px-2 py-1.5 hover:bg-accent hover:text-accent-foreground text-sm"
          >
            <span className="text-muted-foreground">Unassigned</span>
            {selectedUsers.length === 0 && <Plus className="ml-auto h-4 w-4" />}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 