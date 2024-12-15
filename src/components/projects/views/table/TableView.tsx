import { useProjectStore } from '@/stores/project';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';
import { TableGrid } from './TableGrid';

export function TableView() {
  const { currentProject } = useProjectStore();

  if (!currentProject) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <TableToolbar />
      <div className="mt-4 bg-white rounded-lg shadow">
        <TableHeader />
        <TableGrid />
      </div>
    </div>
  );
}