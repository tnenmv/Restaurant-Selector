import type { GeoPoint, Restaurant } from '../../types';

/** Props every map provider implementation must accept. */
export interface MapViewProps {
  restaurants: Restaurant[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  userLocation?: GeoPoint | null;
  className?: string;
}
