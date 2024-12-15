import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/hooks/use-user';

interface UserCellProps {
  value: string | null;
}

export function UserCell({ value }: UserCellProps) {
  const { user, loading } = useUser(value);

  if (loading) {
    return <div className="animate-pulse h-6 w-24 bg-muted rounded" />;
  }

  if (!user) {
    return <div className="text-gray-400">Unassigned</div>;
  }

  const initials = user.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || ''} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{user.full_name}</span>
    </div>
  );
}