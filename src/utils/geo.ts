import type { GeoPoint } from '../types';

const R = 6371; // km

/** Great-circle distance in km (haversine). */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number, lang: 'ar' | 'en'): string {
  if (km < 1) {
    const m = Math.max(50, Math.round((km * 1000) / 50) * 50);
    return lang === 'ar' ? `${m} م` : `${m} m`;
  }
  const v = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return lang === 'ar' ? `${v} كم` : `${v} km`;
}

/** Google Maps universal links — no API key required. */
export function directionsUrl(p: GeoPoint, origin?: GeoPoint | null): string {
  const dest = `${p.latitude},${p.longitude}`;
  const o = origin ? `&origin=${origin.latitude},${origin.longitude}` : '';
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}${o}`;
}

export function placeUrl(p: GeoPoint): string {
  return `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;
}
