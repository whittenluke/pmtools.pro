'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberCellProps {
  value: number | null;
  onChange?: (value: number | null) => void;
  config?: {
    mode?: 'decimal' | 'integer' | 'currency' | 'percentage';
    precision?: number;
    currency?: string;
  };
}

export function NumberCell({ 
  value, 
  onChange,
  config = {
    mode: 'decimal',
    precision: 2,
    currency: 'USD'
  }
}: NumberCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value?.toString() || '');

  const handleClick = () => {
    setIsEditing(true);
  };

  const formatValue = (val: number | null) => {
    if (val === null) return '';

    const { mode = 'decimal', precision = 2, currency = 'USD' } = config;

    switch (mode) {
      case 'currency':
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency,
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(val);
      case 'percentage':
        return new Intl.NumberFormat(undefined, {
          style: 'percent',
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(val / 100);
      case 'integer':
        return new Intl.NumberFormat(undefined, {
          maximumFractionDigits: 0,
        }).format(val);
      case 'decimal':
      default:
        return new Intl.NumberFormat(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(val);
    }
  };

  const parseValue = (text: string): number | null => {
    const cleanText = text.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleanText);
    return isNaN(num) ? null : num;
  };

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = parseValue(text);
    if (newValue !== value) {
      onChange?.(newValue);
    }
    setText(value?.toString() || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      const newValue = parseValue(text);
      if (newValue !== value) {
        onChange?.(newValue);
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(value?.toString() || '');
    }
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-8"
        type="text"
        placeholder="Enter number..."
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "min-h-[32px] px-2 py-1",
        "cursor-text",
        "text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        "text-right"
      )}
    >
      {value !== null ? formatValue(value) : ''}
    </div>
  );
} 