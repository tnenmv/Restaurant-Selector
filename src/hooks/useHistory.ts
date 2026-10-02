import { useCallback } from 'react';
import type { HistoryEntry, PickMode } from '../types';
import { useLocalStorage } from './useLocalStorage';

const MAX_ENTRIES = 30;

/** Newest-first list of picks; each restaurant appears once (latest pick wins). */
export function useHistory() {
  const [entries, setEntries] = useLocalStorage<HistoryEntry[]>('history', []);

  const add = useCallback(
    (restaurantId: string, mode: PickMode) =>
      setEntries((cur) =>
        [{ restaurantId, mode, pickedAt: Date.now() }, ...cur.filter((e) => e.restaurantId !== restaurantId)].slice(
          0,
          MAX_ENTRIES,
        ),
      ),
    [setEntries],
  );
  const remove = useCallback(
    (restaurantId: string) => setEntries((cur) => cur.filter((e) => e.restaurantId !== restaurantId)),
    [setEntries],
  );
  const clear = useCallback(() => setEntries([]), [setEntries]);

  return { entries, add, remove, clear };
}
