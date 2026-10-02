import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [ids, setIds] = useLocalStorage<string[]>('favorites', []);
  const set = useMemo(() => new Set(ids), [ids]);

  const isFavorite = useCallback((id: string) => set.has(id), [set]);
  const add = useCallback((id: string) => setIds((cur) => (cur.includes(id) ? cur : [id, ...cur])), [setIds]);
  const remove = useCallback((id: string) => setIds((cur) => cur.filter((x) => x !== id)), [setIds]);
  /** Returns true if the restaurant is now a favourite. */
  const toggle = useCallback(
    (id: string) => {
      const next = !set.has(id);
      if (next) add(id);
      else remove(id);
      return next;
    },
    [set, add, remove],
  );

  return { ids, isFavorite, add, remove, toggle };
}
