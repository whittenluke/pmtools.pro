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

const statuses = [
  {
    value: 'not_started',
    label: 'Not Started',
    color: 'bg-gray-100 text-gray-900',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-900',
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'bg-green-100 text-green-900',
  },
  {
    value: 'blocked',
    label: 'Blocked',
    color: 'bg-red-100 text-red-900',
  },
];

interface StatusCellProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusCell({ value, onChange }: StatusCellProps) {
  const [open, setOpen] = useState(false);
  const selectedStatus = statuses.find((status) => status.value === value) || statuses[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            selectedStatus.color
          )}
        >
          {selectedStatus.label}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {statuses.map((status) => (
              <CommandItem
                key={status.value}
                onSelect={() => {
                  onChange(status.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2',
                  status.color
                )}
              >
                {status.label}
                {status.value === selectedStatus.value && (
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