import { format } from 'date-fns';

interface DateCellProps {
  value: string | null;
}

export function DateCell({ value }: DateCellProps) {
  if (!value) return <div className="text-gray-400">No date</div>;

  return (
    <div className="text-sm">
      {format(new Date(value), 'MMM d, yyyy')}
    </div>
  );
}