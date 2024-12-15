import { useState } from 'react';

interface TextCellProps {
  value: string;
  onEdit: (isEditing: boolean) => void;
}

export function TextCell({ value, onEdit }: TextCellProps) {
  const [localValue, setLocalValue] = useState(value);

  return (
    <div
      className="min-h-[24px] rounded px-2 hover:bg-gray-100"
      onClick={() => onEdit(true)}
    >
      {localValue}
    </div>
  );
}