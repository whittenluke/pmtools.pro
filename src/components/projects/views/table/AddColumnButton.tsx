import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const columnTypes = [
  {
    id: 'text',
    label: 'Text',
    description: 'Single line or paragraph text',
  },
  {
    id: 'number',
    label: 'Number',
    description: 'Numbers, currencies, ratings',
  },
  {
    id: 'date',
    label: 'Date',
    description: 'Date and time',
  },
  {
    id: 'person',
    label: 'Person',
    description: 'Assign to team members',
  },
  {
    id: 'status',
    label: 'Status',
    description: 'Track progress with custom statuses',
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    description: 'Yes/no or done/not done',
  },
];

interface AddColumnButtonProps {
  onAddColumn: (type: string) => void;
}

export function AddColumnButton({ onAddColumn }: AddColumnButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add column</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {columnTypes.map((type) => (
          <DropdownMenuItem
            key={type.id}
            onClick={() => onAddColumn(type.id)}
            className="flex flex-col items-start py-2"
          >
            <div className="font-medium">{type.label}</div>
            <div className="text-xs text-muted-foreground">{type.description}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 