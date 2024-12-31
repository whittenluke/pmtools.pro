import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

interface DateCellProps {
  value: string | null;
  onChange: (date: Date | null) => void;
}

export function DateCell({ value, onChange }: DateCellProps) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(value) : null;

  const handleSelect = (date: Date | undefined) => {
    setOpen(false);
    onChange(date || null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-left font-normal h-8',
            !date && 'text-muted-foreground hover:text-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {date ? format(date, 'MMM d, yyyy') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}