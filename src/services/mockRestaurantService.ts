import { SAMPLE_RESTAURANTS } from '../data/restaurants';
import { applyQuery } from '../utils/filters';
import type { RestaurantService } from './restaurantService';

/** Local, in-memory implementation backed by the prototype dataset. */
export function createMockRestaurantService(latencyMs = 150): RestaurantService {
  const wait = () => new Promise((r) => setTimeout(r, latencyMs));
  return {
    source: 'mock',
    async getRestaurants() {
      await wait();
      return SAMPLE_RESTAURANTS;
    },
    async getRestaurantById(id) {
      await wait();
      return SAMPLE_RESTAURANTS.find((r) => r.id === id);
    },
    async searchRestaurants(query) {
      await wait();
      return applyQuery(SAMPLE_RESTAURANTS, query);
    },
  };
}
