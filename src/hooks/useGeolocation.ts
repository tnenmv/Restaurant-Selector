import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentPosition, type LocationError } from '../services/locationService';
import type { GeoPoint } from '../types';

export type LocationStatus = 'idle' | 'locating' | 'granted' | LocationError;

export function useGeolocation() {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const inflight = useRef<Promise<GeoPoint | null> | null>(null);

  const request = useCallback((): Promise<GeoPoint | null> => {
    if (inflight.current) return inflight.current;
    setStatus('locating');
    const p = getCurrentPosition()
      .then((pos) => {
        setLocation(pos);
        setStatus('granted');
        return pos;
      })
      .catch((err: LocationError) => {
        setStatus(err);
        return null;
      })
      .finally(() => {
        inflight.current = null;
      });
    inflight.current = p;
    return p;
  }, []);

  // If permission was already granted earlier, fetch silently. Never prompts on load.
  useEffect(() => {
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((s) => {
        if (s.state === 'granted') void request();
      })
      .catch(() => {});
  }, [request]);

  return { location, status, request };
}
