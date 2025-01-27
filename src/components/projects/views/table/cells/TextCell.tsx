'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextCellProps {
  value: string;
  onChange?: (value: string) => void;
}

export function TextCell({ value = '', onChange }: TextCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onChange?.(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      setIsEditing(false);
      if (text !== value) {
        onChange?.(text);
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(value);
    }
  };

  if (isEditing) {
    return (
      <Textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[32px] max-h-[200px]",
          "resize-y",
          "bg-background text-foreground",
          "p-2"
        )}
        placeholder="Enter text..."
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "min-h-[32px] max-h-[200px]",
        "w-full h-full",
        "px-2 py-1.5",
        "cursor-text",
        "text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        "whitespace-pre-wrap break-words",
        "overflow-y-auto",
        "flex items-center"
      )}
    >
      {value || text || (
        <span className="text-muted-foreground text-sm">Click to edit...</span>
      )}
    </div>
  );
}