import type { Restaurant } from '../types';
import { applyQuery } from '../utils/filters';
import { RestaurantServiceError } from './errors';
import type { RestaurantService } from './restaurantService';

/**
 * Example adapter for a custom backend. Expected contract:
 *   GET {baseUrl}/restaurants        → Restaurant[]
 *   GET {baseUrl}/restaurants/:id    → Restaurant
 * Filtering runs client-side so the backend can start simple; move it
 * server-side by adding query params in `searchRestaurants`.
 *
 * A Google Places adapter would map Place results onto `Restaurant` here
 * (price_level → priceLevel, geometry.location → latitude/longitude, …),
 * reading its key from an env var — never hard-coded.
 */
export function createHttpRestaurantService(baseUrl: string, fallback?: RestaurantService): RestaurantService {
  let cache: Restaurant[] | null = null;

  async function load(): Promise<Restaurant[]> {
    if (cache) return cache;
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/restaurants`);
      if (!res.ok) throw new RestaurantServiceError(`HTTP ${res.status}`);
      cache = (await res.json()) as Restaurant[];
      return cache;
    } catch (err) {
      if (fallback) {
        console.warn('[restaurantService] API unavailable, using sample data', err);
        return fallback.getRestaurants();
      }
      throw new RestaurantServiceError('Restaurant API unavailable', err);
    }
  }

  return {
    source: 'http',
    getRestaurants: load,
    async getRestaurantById(id) {
      return (await load()).find((r) => r.id === id);
    },
    async searchRestaurants(query) {
      return applyQuery(await load(), query);
    },
  };
}
