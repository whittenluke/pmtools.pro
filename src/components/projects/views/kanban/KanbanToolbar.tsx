import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterIcon } from '@/components/icons/Filter';
import { SortIcon } from '@/components/icons/Sort';
import { GroupIcon } from '@/components/icons/Group';

export function KanbanToolbar() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search tasks..."
          className="max-w-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <GroupIcon className="h-4 w-4 mr-2" />
          Group by
        </Button>
        <Button variant="outline" size="sm">
          <SortIcon className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>
    </div>
  );
}