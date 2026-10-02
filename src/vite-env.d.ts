/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RESTAURANT_SOURCE?: string;
  readonly VITE_RESTAURANT_API_URL?: string;
  readonly VITE_MAP_PROVIDER?: string;
  readonly VITE_MAP_TILE_URL?: string;
  readonly VITE_MAP_ATTRIBUTION?: string;
}
