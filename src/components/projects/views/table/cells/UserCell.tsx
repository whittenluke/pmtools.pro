import { Avatar } from '@/components/ui/avatar';
import { useUser } from '@/hooks/use-user';

interface UserCellProps {
  value: string | null;
}

export function UserCell({ value }: UserCellProps) {
  const { user } = useUser(value);

  if (!user) return <div className="text-gray-400">Unassigned</div>;

  return (
    <div className="flex items-center gap-2">
      <Avatar
        src={user.avatar_url}
        alt={user.name}
        className="h-6 w-6"
      />
      <span className="text-sm">{user.name}</span>
    </div>
  );
}