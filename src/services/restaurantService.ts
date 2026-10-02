import type { Restaurant, SearchQuery } from '../types';
import { createMockRestaurantService } from './mockRestaurantService';
import { createHttpRestaurantService } from './httpRestaurantService';

/**
 * The single contract the UI depends on. Swap the implementation (Google
 * Places, a custom backend, open data…) without touching components.
 */
export interface RestaurantService {
  readonly source: 'mock' | 'http' | string;
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: string): Promise<Restaurant | undefined>;
  searchRestaurants(query: SearchQuery): Promise<Restaurant[]>;
}

export { RestaurantServiceError } from './errors';

function createService(): RestaurantService {
  const source = import.meta.env.VITE_RESTAURANT_SOURCE ?? 'mock';
  const apiUrl = import.meta.env.VITE_RESTAURANT_API_URL as string | undefined;
  if (source === 'http' && apiUrl) {
    // Falls back to the bundled sample data if the API is unreachable.
    return createHttpRestaurantService(apiUrl, createMockRestaurantService());
  }
  return createMockRestaurantService();
}

export const restaurantService: RestaurantService = createService();
