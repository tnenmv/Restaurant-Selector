import type { Restaurant, SearchQuery } from '../types';
import { createMockRestaurantService } from './mockRestaurantService';
import { createHttpRestaurantService } from './httpRestaurantService';
import { createOvertureRestaurantService } from './overtureRestaurantService';

/**
 * The single contract the UI depends on. Swap the implementation (Google
 * Places, a custom backend, open data…) without touching components.
 */
export interface RestaurantService {
  readonly source: 'overture' | 'mock' | 'http' | string;
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: string): Promise<Restaurant | undefined>;
  searchRestaurants(query: SearchQuery): Promise<Restaurant[]>;
}

export { RestaurantServiceError } from './errors';

function createService(): RestaurantService {
  const source = import.meta.env.VITE_RESTAURANT_SOURCE ?? 'overture';
  const apiUrl = import.meta.env.VITE_RESTAURANT_API_URL as string | undefined;
  if (source === 'http' && apiUrl) {
    // Falls back to the bundled real data if the API is unreachable.
    return createHttpRestaurantService(apiUrl, createOvertureRestaurantService());
  }
  // "sample" = the fictional 38-restaurant prototype dataset.
  if (source === 'sample' || source === 'mock') return createMockRestaurantService();
  return createOvertureRestaurantService();
}

export const restaurantService: RestaurantService = createService();
