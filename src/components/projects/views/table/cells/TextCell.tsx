import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface TextCellProps {
  value: string;
  onEdit: (isEditing: boolean) => void;
  onChange?: (value: string) => void;
}

export function TextCell({ value, onEdit, onChange }: TextCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    onEdit(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onEdit(false);
    if (onChange && text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setText(value);
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-8 w-full"
      />
    );
  }

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      className="cursor-text min-h-[32px] flex items-center"
    >
      {text}
    </div>
  );
}