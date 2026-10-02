import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useGeolocation } from '../hooks/useGeolocation';
import { useHistory } from '../hooks/useHistory';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useRestaurants } from '../hooks/useRestaurants';
import { STRINGS, type Strings } from '../i18n/strings';
import type { Lang, Restaurant, RestaurantFilters, SmartPreference } from '../types';
import { EMPTY_FILTERS, preferenceSupported } from '../utils/filters';
import { distanceKm } from '../utils/geo';

export type HomeMode = 'random' | 'smart';

interface Toast {
  id: number;
  text: string;
}

function useAppState() {
  const [lang, setLang] = useLocalStorage<Lang>('lang', 'ar');
  const t: Strings = STRINGS[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const data = useRestaurants();
  const favorites = useFavorites();
  const history = useHistory();
  const geo = useGeolocation();

  const [filters, setFilters] = useLocalStorage<RestaurantFilters>('filters', EMPTY_FILTERS);
  const [preferences, setPreferences] = useLocalStorage<SmartPreference[]>('preferences', []);
  const [homeMode, setHomeMode] = useLocalStorage<HomeMode>('mode', 'random');

  // Saved filters may come from another dataset (e.g. price filters from the sample data).
  // Once data loads, drop anything this data can't answer so picks don't silently come up empty.
  useEffect(() => {
    if (data.status !== 'ready') return;
    const rs = data.restaurants;
    const prefs = preferences.filter((p) => preferenceSupported(rs, p));
    if (prefs.length !== preferences.length) setPreferences(prefs);
    const has = <K extends keyof Restaurant>(k: K, v: Restaurant[K]) => rs.some((r) => r[k] === v);
    const next: RestaurantFilters = {
      cuisines: filters.cuisines.filter((v) => has('cuisine', v)),
      prices: filters.prices.filter((v) => has('priceLevel', v)),
      areas: filters.areas.filter((v) => has('area', v)),
      categories: filters.categories.filter((v) => has('category', v)),
      minRating: rs.some((r) => (r.rating ?? 0) >= filters.minRating) ? filters.minRating : 0,
    };
    if (JSON.stringify(next) !== JSON.stringify(filters)) setFilters(next);
    // Only on data load.
  }, [data.status, data.restaurants]); // eslint-disable-line

  /** Restaurants the user rejected via "لم يعجبني" during this session. */
  const [disliked, setDisliked] = useState<string[]>([]);
  const dislike = useCallback((id: string) => setDisliked((d) => (d.includes(id) ? d : [...d, id])), []);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((cur) => [...cur.slice(-2), { id, text }]);
    window.setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), 2600);
  }, []);

  const byId = useMemo(() => new Map(data.restaurants.map((r) => [r.id, r])), [data.restaurants]);
  const getById = useCallback((id: string) => byId.get(id), [byId]);

  const distanceTo = useCallback(
    (r: Restaurant) => (geo.location ? distanceKm(geo.location, r) : undefined),
    [geo.location],
  );

  const name = useCallback((r: Restaurant) => (lang === 'ar' ? r.name : r.nameEn), [lang]);

  const toggleFavorite = useCallback(
    (r: Restaurant) => {
      const now = favorites.toggle(r.id);
      toast(now ? t.addedFav : t.removedFav);
    },
    [favorites, toast, t],
  );

  return {
    lang,
    setLang,
    t,
    dir,
    ...data,
    getById,
    favorites,
    toggleFavorite,
    history,
    geo,
    distanceTo,
    name,
    filters,
    setFilters,
    preferences,
    setPreferences,
    homeMode,
    setHomeMode,
    disliked,
    dislike,
    toasts,
    toast,
  };
}

export type AppState = ReturnType<typeof useAppState>;

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}
