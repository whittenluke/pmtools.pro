import { useTableColumns } from '@/hooks/use-table-columns';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons/Plus';

export function TableHeader() {
  const { columns, addColumn } = useTableColumns();

  return (
    <div className="border-b border-gray-200">
      <div className="grid grid-cols-[auto,1fr] items-center gap-4 p-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-500">0 selected</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {columns.map((column) => (
              <Button key={column.id} variant="ghost" size="sm">
                {column.title}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={addColumn}>
            <PlusIcon className="h-4 w-4" />
            <span className="ml-2">Add column</span>
          </Button>
        </div>
      </div>
    </div>
  );
}