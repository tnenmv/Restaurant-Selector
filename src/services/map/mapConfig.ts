/**
 * Map provider configuration. The UI only talks to <MapView/>, which picks an
 * implementation from here. To plug in Google Maps / Mapbox later, add a new
 * provider component under components/map and a case below — keys come from
 * env vars (VITE_*), never from source code.
 */
export type MapProvider = 'leaflet' | 'schematic';

export interface MapConfig {
  provider: MapProvider;
  tileUrl: string;
  attribution: string;
}

const env = import.meta.env;

export const mapConfig: MapConfig = {
  provider: (env.VITE_MAP_PROVIDER as MapProvider) || 'leaflet',
  tileUrl: env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    env.VITE_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};
