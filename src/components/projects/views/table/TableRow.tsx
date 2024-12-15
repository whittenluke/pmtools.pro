import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TableRowProps {
  children: React.ReactNode;
}

export function TableRow({ children }: TableRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'grid grid-cols-[auto,1fr] items-center gap-4 p-4',
        isHovered && 'bg-gray-50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="checkbox"
        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {children}
      </div>
    </div>
  );
}