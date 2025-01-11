import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Star, StarHalf } from 'lucide-react';

interface NumberCellProps {
  value: number | null;
  onChange: (value: number | null) => void;
  config?: {
    mode?: 'decimal' | 'integer' | 'currency' | 'percentage' | 'rating';
    precision?: number;
    currency?: string;
    minValue?: number;
    maxValue?: number;
  };
}

export function NumberCell({ value, onChange, config = {} }: NumberCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState<string>(formatValue(value));

  const {
    mode = 'decimal',
    precision = 2,
    currency = 'USD',
    minValue = Number.MIN_SAFE_INTEGER,
    maxValue = Number.MAX_SAFE_INTEGER,
  } = config;

  useEffect(() => {
    setLocalValue(formatValue(value));
  }, [value]);

  function formatValue(val: number | null): string {
    if (val === null) return '';

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
      case 'rating':
        return val.toString();
      case 'integer':
        return Math.round(val).toString();
      case 'decimal':
      default:
        return val.toFixed(precision);
    }
  }

  function parseValue(val: string): number | null {
    if (!val) return null;

    let parsed: number | null = null;

    switch (mode) {
      case 'currency':
        parsed = Number(val.replace(/[^0-9.-]+/g, ''));
        break;
      case 'percentage':
        parsed = Number(val.replace(/[^0-9.-]+/g, '')) / 100;
        break;
      case 'rating':
      case 'integer':
        parsed = Math.round(Number(val));
        break;
      case 'decimal':
      default:
        parsed = Number(val);
    }

    if (isNaN(parsed)) return null;
    
    // Enforce min/max values
    if (parsed < minValue) parsed = minValue;
    if (parsed > maxValue) parsed = maxValue;

    return parsed;
  }

  function handleBlur() {
    setIsEditing(false);
    const parsedValue = parseValue(localValue);
    if (parsedValue !== value) {
      onChange(parsedValue);
    }
  }

  if (mode === 'rating') {
    const rating = value || 0;
    const maxRating = maxValue || 5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className="text-yellow-400 hover:text-yellow-500 transition-colors"
          >
            {i + 1 <= rating ? (
              <Star className="h-4 w-4 fill-current" />
            ) : (
              <Star className="h-4 w-4" />
            )}
          </button>
        ))}
      </div>
    );
  }

  if (isEditing) {
    return (
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleBlur();
          if (e.key === 'Escape') {
            setLocalValue(formatValue(value));
            setIsEditing(false);
          }
        }}
        className="h-8"
        autoFocus
      />
    );
  }

  return (
    <div
      className="min-h-[32px] flex items-center cursor-text"
      onClick={() => setIsEditing(true)}
    >
      {formatValue(value)}
    </div>
  );
} 