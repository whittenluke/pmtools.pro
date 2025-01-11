import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ViewColumn } from '@/types';

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
    submenu: [
      {
        id: 'decimal',
        label: 'Decimal Number',
        description: 'Numbers with decimal places',
        config: {
          mode: 'decimal',
          precision: 2,
        },
      },
      {
        id: 'integer',
        label: 'Integer',
        description: 'Whole numbers',
        config: {
          mode: 'integer',
        },
      },
      {
        id: 'currency',
        label: 'Currency',
        description: 'Money values',
        config: {
          mode: 'currency',
          precision: 2,
          currency: 'USD',
        },
      },
      {
        id: 'percentage',
        label: 'Percentage',
        description: 'Percentage values',
        config: {
          mode: 'percentage',
          precision: 1,
        },
      },
      {
        id: 'rating',
        label: 'Rating',
        description: 'Star rating (1-5)',
        config: {
          mode: 'rating',
          maxValue: 5,
        },
      },
    ],
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
];

interface AddColumnButtonProps {
  onAddColumn: (column: Partial<ViewColumn>) => void;
}

export function AddColumnButton({ onAddColumn }: AddColumnButtonProps) {
  const handleAddColumn = (type: string, config?: Record<string, any>) => {
    const column: Partial<ViewColumn> = {
      title: type.charAt(0).toUpperCase() + type.slice(1),
      type: type as ViewColumn['type'],
      width: 200,
    };

    if (config) {
      column.config = config;
    }

    onAddColumn(column);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add column</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {columnTypes.map((type) => {
          if (type.submenu) {
            return (
              <DropdownMenuSub key={type.id}>
                <DropdownMenuSubTrigger className="flex flex-col items-start py-2">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {type.submenu.map((subtype) => (
                    <DropdownMenuItem
                      key={subtype.id}
                      onClick={() => handleAddColumn(type.id, subtype.config)}
                      className="flex flex-col items-start py-2"
                    >
                      <div className="font-medium">{subtype.label}</div>
                      <div className="text-xs text-muted-foreground">{subtype.description}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          }

          return (
            <DropdownMenuItem
              key={type.id}
              onClick={() => handleAddColumn(type.id)}
              className="flex flex-col items-start py-2"
            >
              <div className="font-medium">{type.label}</div>
              <div className="text-xs text-muted-foreground">{type.description}</div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 