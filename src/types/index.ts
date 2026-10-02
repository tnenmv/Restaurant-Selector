export type Lang = 'ar' | 'en';

export type Cuisine =
  | 'saudi'
  | 'arabic'
  | 'gulf'
  | 'egyptian'
  | 'levantine'
  | 'turkish'
  | 'italian'
  | 'asian'
  | 'japanese'
  | 'indian'
  | 'burger'
  | 'pizza'
  | 'seafood'
  | 'cafe'
  | 'desserts'
  | 'other';

/** نوع المكان */
export type PlaceCategory = 'restaurant' | 'cafe' | 'breakfast' | 'dinner' | 'desserts';

export type PriceLevel = 1 | 2 | 3;

export type AreaId =
  | 'central'
  | 'quba'
  | 'uraid'
  | 'aziziyah'
  | 'difaa'
  | 'sultanah'
  | 'khalidiyah'
  | 'shuran'
  | 'jamiah'
  | 'hijrah'
  | 'uyun'
  | 'aqoul'
  | 'other';

export interface Restaurant {
  id: string;
  name: string;
  nameEn: string;
  category: PlaceCategory;
  cuisine: Cuisine;
  /** null = unknown (e.g. open data sources without prices). */
  priceLevel: PriceLevel | null;
  /** null = no rating available. */
  rating: number | null;
  area: AreaId;
  address?: string;
  addressEn?: string;
  latitude: number;
  longitude: number;
  /** Optional photo URL. When missing or broken, an illustrated cover is rendered instead. */
  image?: string;
  description?: string;
  descriptionEn?: string;
  /** Amenity flags: null = unknown for this source. */
  openNow: boolean | null;
  familyFriendly: boolean | null;
  outdoorSeating: boolean | null;
  quiet: boolean | null;
  groupFriendly: boolean | null;
  website?: string;
  phone?: string;
  /** Upstream data providers for this record (e.g. "meta", "Foursquare"). */
  sources?: string[];
  /** True for the fictional prototype dataset; false for real-world data. */
  isSample: boolean;
}

export type MinRating = 0 | 3 | 4 | 4.5;

export interface RestaurantFilters {
  cuisines: Cuisine[];
  prices: PriceLevel[];
  areas: AreaId[];
  categories: PlaceCategory[];
  minRating: MinRating;
}

export type SmartPreference =
  | 'nearMe'
  | 'family'
  | 'quiet'
  | 'outdoor'
  | 'groups'
  | 'budget'
  | 'openNow';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface SearchQuery {
  filters?: RestaurantFilters;
  preferences?: SmartPreference[];
  /** Needed for the "nearMe" preference and for distance sorting. */
  origin?: GeoPoint | null;
  /** Radius in km used for "nearMe". */
  nearRadiusKm?: number;
}

export interface HistoryEntry {
  restaurantId: string;
  pickedAt: number;
  mode: PickMode;
}

export type PickMode = 'random' | 'smart' | 'favorites' | 'history' | 'group';
