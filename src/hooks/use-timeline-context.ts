import { useState, useMemo } from 'react';
import { eachDayOfInterval, addDays, subDays } from 'date-fns';

export function useTimelineContext() {
  const [baseColumnWidth] = useState(100);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [centerDate] = useState(new Date());

  const columnWidth = useMemo(() => {
    return (baseColumnWidth * zoomLevel) / 100;
  }, [baseColumnWidth, zoomLevel]);

  const visibleDates = useMemo(() => {
    const start = subDays(centerDate, 15);
    const end = addDays(centerDate, 15);
    return eachDayOfInterval({ start, end });
  }, [centerDate]);

  return {
    columnWidth,
    visibleDates,
    zoomLevel,
    setZoomLevel,
  };
}