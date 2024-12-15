import { Badge } from '@/components/ui/badge';

interface StatusCellProps {
  value: string;
}

export function StatusCell({ value }: StatusCellProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusColor(value)}>
      {value.replace('_', ' ')}
    </Badge>
  );
}