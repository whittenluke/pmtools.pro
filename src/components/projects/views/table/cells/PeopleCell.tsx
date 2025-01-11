import React, { useState } from 'react';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';

interface PeopleCellProps {
  value: string | string[] | null;
  row: any;
  workspaceId: string;
  onUpdate: (userIds: string[] | null) => void;
  allowMultiple?: boolean;
}

export function PeopleCell({ value, row, workspaceId, onUpdate, allowMultiple = false }: PeopleCellProps) {
  const [open, setOpen] = useState(false);
  const { members } = useWorkspaceMembers(workspaceId);
  const selectedUsers = Array.isArray(value) ? 
    members.filter(member => value.includes(member.user_id)) :
    value ? [members.find(member => member.user_id === value)] : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedUsers.length > 0 ? (
              <>
                <div className="flex -space-x-2">
                  {selectedUsers.map((user, i) => user && (
                    <Avatar key={user.user_id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={user.profile?.avatar_url || ''} />
                      <AvatarFallback>
                        {user.profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="truncate">
                  {selectedUsers.map(user => user?.profile?.full_name).join(', ')}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">Unassigned</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                onUpdate(null);
                setOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <span className="text-muted-foreground">Unassigned</span>
              {selectedUsers.length === 0 && <Check className="ml-auto h-4 w-4" />}
            </CommandItem>
            {members.map((member) => (
              <CommandItem
                key={member.user_id}
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
                    {member.profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{member.profile?.full_name}</span>
                {(Array.isArray(value) ? value.includes(member.user_id) : member.user_id === value) && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 