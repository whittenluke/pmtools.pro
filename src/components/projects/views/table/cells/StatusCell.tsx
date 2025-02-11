'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { StatusSettings } from '../StatusSettings';
import { Separator } from '@/components/ui/separator';
import type { Status, StatusConfig } from '@/types/database';

const defaultConfig: StatusConfig = {
  statuses: [
    {
      id: 'not_started',
      title: 'Not Started',
      color: '#E5E7EB',
      position: 0,
      type: 'default'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: '#93C5FD',
      position: 1,
      type: 'default'
    },
    {
      id: 'completed',
      title: 'Completed',
      color: '#86EFAC',
      position: 2,
      type: 'default'
    },
    {
      id: 'blocked',
      title: 'Blocked',
      color: '#FCA5A5',
      position: 3,
      type: 'default'
    }
  ],
  defaultStatusId: 'not_started'
};

interface StatusCellProps {
  value: string;
  config?: StatusConfig;
  onConfigChange?: (config: StatusConfig) => void;
  onChange: (value: string) => void;
}

export function StatusCell({
  value,
  config = defaultConfig,
  onConfigChange,
  onChange,
}: StatusCellProps) {
  const [open, setOpen] = useState(false);

  // Find the current status or use default
  const selectedStatus = config.statuses.find((status) => status.id === value) || 
    config.statuses.find((status) => status.id === config.defaultStatusId) ||
    config.statuses[0];

  const getStatusStyle = (status: Status) => {
    const color = status.color;
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    
    // Calculate perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // For light backgrounds in dark mode, use a darker version of the color
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark && brightness > 128) {
      // Darken the color by 40%
      const darkenFactor = 0.6;
      const newR = Math.round(r * darkenFactor);
      const newG = Math.round(g * darkenFactor);
      const newB = Math.round(b * darkenFactor);
      return {
        background: `rgb(${newR}, ${newG}, ${newB})`,
        color: 'white'
      };
    }
    
    return {
      background: status.color,
      color: brightness > 128 ? '#1F2937' : 'white'
    };
  };

  const handleSelect = (status: Status) => {
    onChange(status.id);
    setOpen(false);
  };

  const statusStyle = getStatusStyle(selectedStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full h-8 px-2 relative"
          style={{
            backgroundColor: statusStyle.background,
            color: statusStyle.color,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center">
            {selectedStatus.title}
          </span>
          <ChevronDown className="absolute right-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="flex flex-col">
          {config.statuses
            .sort((a, b) => a.position - b.position)
            .map((status) => {
              const style = getStatusStyle(status);
              return (
                <button
                  key={status.id}
                  onClick={() => handleSelect(status)}
                  className="relative w-full px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
                  style={{
                    backgroundColor: style.background,
                    color: style.color,
                  }}
                >
                  <span className="flex items-center justify-center">
                    {status.title}
                  </span>
                  {status.id === selectedStatus.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            })}
          {onConfigChange && (
            <>
              <Separator />
              <StatusSettings config={config} onChange={onConfigChange} />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}