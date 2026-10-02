import { useCallback, useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

/** useState that persists to localStorage (safely — falls back to memory). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJSON(key, initial));
  useEffect(() => writeJSON(key, value), [key, value]);
  const reset = useCallback(() => setValue(initial), [initial]);
  return [value, setValue, reset] as const;
}
