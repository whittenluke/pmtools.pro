import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FilterIcon } from '@/components/icons/Filter';
import { ZoomInIcon } from '@/components/icons/ZoomIn';
import { ZoomOutIcon } from '@/components/icons/ZoomOut';
import { useTimelineZoom } from '@/hooks/use-timeline-zoom';

export function TimelineToolbar() {
  const { zoomLevel, zoomIn, zoomOut } = useTimelineZoom();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Input
          type="search"
          placeholder="Search tasks..."
          className="w-64"
        />
        <Select
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
          ]}
          value="week"
          onChange={() => {}}
          className="w-32"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <div className="flex items-center gap-1 border rounded-md">
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <ZoomOutIcon className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm">{zoomLevel}%</span>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <ZoomInIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}