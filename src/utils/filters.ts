import type { Restaurant, RestaurantFilters, SearchQuery, SmartPreference } from '../types';
import { distanceKm } from './geo';

export const EMPTY_FILTERS: RestaurantFilters = {
  cuisines: [],
  prices: [],
  areas: [],
  categories: [],
  minRating: 0,
};

export function countActiveFilters(f: RestaurantFilters): number {
  return f.cuisines.length + f.prices.length + f.areas.length + f.categories.length + (f.minRating > 0 ? 1 : 0);
}

export function matchesFilters(r: Restaurant, f: RestaurantFilters): boolean {
  if (f.cuisines.length && !f.cuisines.includes(r.cuisine)) return false;
  if (f.prices.length && (r.priceLevel === null || !f.prices.includes(r.priceLevel))) return false;
  if (f.areas.length && !f.areas.includes(r.area)) return false;
  if (f.categories.length && !f.categories.includes(r.category)) return false;
  if (f.minRating > 0 && (r.rating ?? 0) < f.minRating) return false;
  return true;
}

const PREFERENCE_TESTS: Record<Exclude<SmartPreference, 'nearMe'>, (r: Restaurant) => boolean> = {
  family: (r) => r.familyFriendly === true,
  quiet: (r) => r.quiet === true,
  outdoor: (r) => r.outdoorSeating === true,
  groups: (r) => r.groupFriendly === true,
  budget: (r) => r.priceLevel === 1,
  openNow: (r) => r.openNow === true,
};

/** Whether a preference can be answered by this data at all (some sources lack amenity info). */
export function preferenceSupported(all: Restaurant[], p: SmartPreference): boolean {
  return p === 'nearMe' || all.some(PREFERENCE_TESTS[p]);
}

export const DEFAULT_NEAR_RADIUS_KM = 5;

/** Applies filters + smart preferences. "nearMe" is ignored when origin is unknown. */
export function applyQuery(all: Restaurant[], q: SearchQuery): Restaurant[] {
  let out = q.filters ? all.filter((r) => matchesFilters(r, q.filters!)) : [...all];
  for (const p of q.preferences ?? []) {
    if (p === 'nearMe') continue;
    out = out.filter(PREFERENCE_TESTS[p]);
  }
  if (q.preferences?.includes('nearMe') && q.origin) {
    const radius = q.nearRadiusKm ?? DEFAULT_NEAR_RADIUS_KM;
    const withDist = out
      .map((r) => ({ r, d: distanceKm(q.origin!, r) }))
      .sort((a, b) => a.d - b.d);
    const inside = withDist.filter((x) => x.d <= radius);
    // If nothing is within the radius, fall back to the closest handful.
    out = (inside.length ? inside : withDist.slice(0, 5)).map((x) => x.r);
  }
  return out;
}
