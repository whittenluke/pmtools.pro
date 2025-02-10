import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorkspaceStore } from '@/store/workspaceStore';
import type { WorkspaceMember } from '@/types/database';

interface UserCellProps {
  value: string | null;
  onChange: (userId: string) => Promise<void>;
}

export function UserCell({ value, onChange }: UserCellProps) {
  const [open, setOpen] = useState(false);
  const { members } = useWorkspaceStore();
  const selectedUser = members.find((member: WorkspaceMember) => member.user_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedUser ? (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedUser.profile.avatar_url || ''} />
                  <AvatarFallback>
                    {selectedUser.profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedUser.profile.full_name}</span>
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
            {members.map((member: WorkspaceMember) => (
              <CommandItem
                key={member.user_id}
                onSelect={() => {
                  onChange(member.user_id);
                  setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.profile.avatar_url || ''} />
                  <AvatarFallback>
                    {member.profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{member.profile.full_name}</span>
                {member.user_id === selectedUser?.user_id && (
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