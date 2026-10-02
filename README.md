# وش ناكل؟ | Madinah Random

> خلّ الاختيار علينا 🍽️ — Open → press one button → get a restaurant.

A fun, Arabic-first (RTL) web app that **randomly picks a restaurant in Madinah** for you, with an optional English switch.

> ⚠️ **Prototype / sample data.** Every restaurant in `src/data/restaurants.ts` is **fictional**: names, ratings, prices, hours and descriptions were made up for this prototype and are **not** verified real-world information. District names are real Madinah neighbourhoods; coordinates are approximate points inside them. The UI labels this data as «بيانات تجريبية».

## Features

- **🎲 One-tap random pick** with a slot-machine reveal: the button switches to a loading state, names and covers cycle fast, slow down, then the winner pops in with confetti and a haptic tick (shorter when the user prefers reduced motion).
- **✨ Smart mode** (عشوائي حسب تفضيلاتي): near me, family friendly, quiet, outdoor seating, groups, budget, open now.
- **Pick options** (خيارات الاختيار) in a collapsible panel: cuisine (16 types), price ($/$$/$$$), area (12 districts), place type, minimum rating. A live counter shows how many places match.
- **Real randomness**: picks use `crypto.getRandomValues` with rejection sampling. Recent picks are excluded (the window scales with pool size). «لم يعجبني هذا الاختيار» also excludes that place for the rest of the session.
- **No-match state** (ما لقينا مطاعم تطابق اختياراتك 😅) with *تعديل الخيارات* and *إعادة ضبط الفلاتر* buttons.
- **❤️ Favourites** and **🕘 History**, both saved in localStorage: save or remove items, and pick randomly from either list.
- **👥 Group mode**: choose the number of people, get a playful draw, and see a rough group cost estimate.
- **🗺️ Map**: Leaflet with OpenStreetMap tiles (no API key). It has markers, a selection card, distance and Google Maps directions links. If tiles can't load, it **falls back automatically** to an offline schematic map.
- **📍 Location (optional)**: used for distances, "nearest" sorting and *near me*. If permission is denied, the app keeps working normally. It never prompts on load.
- **Restaurant details page**: large cover, badges, address, mini-map, directions and share.
- **Polished empty, loading and error states**: no results, API unavailable, location unavailable, no favourites, no history, skeleton loaders, and an illustrated cover when an image is missing or broken.
- **Responsive**: mobile-first with a bottom navigation (الرئيسية | الخريطة | المفضلة | السجل). On desktop this becomes a top navigation with a two-column home layout.

## Stack

React 19 · TypeScript · Tailwind CSS 3 · Vite · React Router (hash routing, so it works on any static host) · Leaflet / react-leaflet · Vitest · Playwright (E2E).

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
npm test             # unit tests (randomness, filters, service contract, dataset)
npm run test:e2e     # full user-flow E2E against the production build (needs Chromium)
```

`test:e2e` uses `playwright-core` with the Chromium at `/opt/pw-browsers/...`. Set `CHROMIUM_PATH` to point it at another browser, and `SHOTS=dir` to save screenshots.

## Project structure

```
src/
  components/        UI building blocks (PickButton, SlotReel, ResultCard, FilterPanel, Navigation, …)
    map/             MapView (provider switch) → LeafletMapView | SchematicMapView
  pages/             Home, Map, Favorites, History, Group, Restaurant details
  data/              restaurants.ts (sample data), options.ts (cuisines, areas, prices… ar/en labels)
  hooks/             usePicker (spin + reveal), useFavorites, useHistory, useGeolocation, useRestaurants, useLocalStorage
  services/          restaurantService (contract + factory), mock/http implementations, locationService, map/mapConfig
  utils/             random.ts, filters.ts, geo.ts, storage.ts
  context/           AppContext: language, data, favourites, history, location, filters, toasts
  i18n/              strings.ts (Arabic + English)
  types/             shared domain types
```

## Replacing the data source

The UI only talks to `restaurantService` (`src/services/restaurantService.ts`):

```ts
interface RestaurantService {
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: string): Promise<Restaurant | undefined>;
  searchRestaurants(query: SearchQuery): Promise<Restaurant[]>;
}
```

- **Default:** `mockRestaurantService` serves the bundled sample dataset with a small simulated latency.
- **Custom backend:** set `VITE_RESTAURANT_SOURCE=http` and `VITE_RESTAURANT_API_URL=…` (see `.env.example`). `httpRestaurantService` expects `GET /restaurants` and `GET /restaurants/:id`. If the API is unreachable, it falls back to the sample data, so the app still works.
- **Google Places / open data / anything else:** write an adapter that maps results onto the `Restaurant` type and return it from `createService()`. Read keys from `import.meta.env`, never from source.

## Map providers

`<MapView/>` chooses an implementation using `src/services/map/mapConfig.ts`:

- `VITE_MAP_PROVIDER=leaflet` (default). Uses `VITE_MAP_TILE_URL` and `VITE_MAP_ATTRIBUTION`, or OpenStreetMap when those are unset.
- `VITE_MAP_PROVIDER=schematic` forces the offline map.

To add Google Maps or Mapbox, write a component that implements `MapViewProps` (`components/map/types.ts`) and add a case in `MapView.tsx`. Keep API keys in env vars. **No keys are committed.**

Directions use Google Maps universal links (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`), which need no key.
