import React, { useState } from 'react';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PeopleCellProps {
  value: string | string[] | null;
  row: any;
  workspaceId: string;
  onUpdate: (userIds: string[] | null) => void;
  allowMultiple?: boolean;
}

export function PeopleCell({ value, row, workspaceId, onUpdate, allowMultiple = false }: PeopleCellProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const { members } = useWorkspaceMembers(workspaceId);
  const selectedUsers = Array.isArray(value) ? 
    members.filter(member => value.includes(member.user_id)) :
    value ? [members.find(member => member.user_id === value)] : [];

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
                selectedUsers.map((user) => (
                  <TooltipProvider key={user.user_id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-7 w-7 border-2 border-background">
                          <AvatarImage src={user.profile?.avatar_url || ''} />
                          <AvatarFallback>
                            {user.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{user.profile?.full_name}</p>
                        <p className="text-muted-foreground text-sm">{user.profile?.email}</p>
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
        <Command value={value || ''}>
          <CommandGroup>
            <CommandItem
              value="unassigned"
              onSelect={() => {
                onUpdate(null);
                setOpen(false);
              }}
            >
              <span className="text-muted-foreground">Unassigned</span>
              {selectedUsers.length === 0 && <Plus className="ml-auto h-4 w-4" />}
            </CommandItem>
            {members.map((member) => (
              <CommandItem
                key={member.user_id}
                value={member.user_id}
                onSelect={() => {
                  if (allowMultiple) {
                    const currentValue = Array.isArray(value) ? value : value ? [value] : [];
                    const newValue = currentValue.includes(member.user_id)
                      ? currentValue.filter(id => id !== member.user_id)
                      : [...currentValue, member.user_id];
                    onUpdate(newValue.length > 0 ? newValue : null);
                  } else {
                    onUpdate([member.user_id]);
                  }
                  if (!allowMultiple) setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.profile?.avatar_url || ''} />
                  <AvatarFallback>
                    {member.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{member.profile?.full_name}</span>
                {(Array.isArray(value) ? value.includes(member.user_id) : member.user_id === value) && (
                  <X className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 