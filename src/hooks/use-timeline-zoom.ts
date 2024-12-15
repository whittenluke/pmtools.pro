import { useState, useCallback } from 'react';

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_STEP = 25;

export function useTimelineZoom() {
  const [zoomLevel, setZoomLevel] = useState(100);

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  return {
    zoomLevel,
    zoomIn,
    zoomOut,
  };
}