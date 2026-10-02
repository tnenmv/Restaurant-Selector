import { CUISINES } from '../../data/options';
import type { PlaceCategory, Restaurant } from '../../types';

export const markerIcon = (r: Restaurant) => CUISINES.find((c) => c.value === r.cuisine)?.icon ?? '🍽️';

/** Above this many markers, maps switch to small dots so the city stays readable. */
export const DENSE_THRESHOLD = 120;

export const CATEGORY_DOT: Record<PlaceCategory, string> = {
  restaurant: '#18794e',
  cafe: '#8c4a27',
  breakfast: '#c27d36',
  dinner: '#134d37',
  desserts: '#c2185b',
};
