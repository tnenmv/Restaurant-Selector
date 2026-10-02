import { CUISINES } from '../../data/options';
import type { Restaurant } from '../../types';

export const markerIcon = (r: Restaurant) => CUISINES.find((c) => c.value === r.cuisine)?.icon ?? '🍽️';
