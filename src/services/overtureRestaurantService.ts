import { loadMadinahPlaces } from '../data/madinahPlaces';
import type { Restaurant } from '../types';
import { applyQuery } from '../utils/filters';
import type { RestaurantService } from './restaurantService';

/** Real places from the bundled Overture Maps extract (no network needed at runtime). */
export function createOvertureRestaurantService(): RestaurantService {
  let cache: Promise<Restaurant[]> | null = null;
  const load = () => (cache ??= loadMadinahPlaces().then((d) => d.restaurants));
  return {
    source: 'overture',
    getRestaurants: load,
    async getRestaurantById(id) {
      return (await load()).find((r) => r.id === id);
    },
    async searchRestaurants(query) {
      return applyQuery(await load(), query);
    },
  };
}
