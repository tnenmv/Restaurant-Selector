import { useCallback, useEffect, useState } from 'react';
import { restaurantService } from '../services/restaurantService';
import type { Restaurant } from '../types';

export type LoadStatus = 'loading' | 'ready' | 'error';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');

  const load = useCallback(() => {
    setStatus('loading');
    restaurantService
      .getRestaurants()
      .then((list) => {
        setRestaurants(list);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(load, [load]);

  return { restaurants, status, retry: load, source: restaurantService.source };
}
