import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { MADINAH_CENTER } from '../../data/options';
import { mapConfig } from '../../services/map/mapConfig';
import { CATEGORY_DOT, DENSE_THRESHOLD, markerIcon } from './markers';
import type { MapViewProps } from './types';

const iconCache = new Map<string, L.DivIcon>();
function pin(emoji: string, selected: boolean) {
  const key = emoji + selected;
  let icon = iconCache.get(key);
  if (!icon) {
    const size = selected ? 48 : 38;
    icon = L.divIcon({
      className: 'emoji-pin',
      iconSize: [size, size + 8],
      iconAnchor: [size / 2, size + 6],
      html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${
        selected ? '#c27d36' : '#18794e'
      };display:grid;place-items:center;box-shadow:0 6px 14px -4px rgba(0,0,0,.4);border:3px solid #fff"><span style="transform:rotate(45deg);font-size:${
        selected ? 22 : 17
      }px">${emoji}</span></div>`,
    });
    iconCache.set(key, icon);
  }
  return icon;
}

function FlyToSelected({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [map, target]);
  return null;
}

/**
 * Real interactive map (Leaflet + configurable tiles, OpenStreetMap by default — no key).
 * Calls `onTilesFailed` when tiles can't load so the caller can fall back.
 */
export function LeafletMapView({
  restaurants,
  selectedId,
  onSelect,
  userLocation,
  className = '',
  onTilesFailed,
}: MapViewProps & { onTilesFailed?: () => void }) {
  const loaded = useRef(false);
  const errors = useRef(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!loaded.current) onTilesFailed?.();
    }, 5000);
    return () => window.clearTimeout(id);
  }, [onTilesFailed]);

  const selected = restaurants.find((r) => r.id === selectedId);

  return (
    <div dir="ltr" className={`overflow-hidden ${className}`}>
      <MapContainer center={MADINAH_CENTER} zoom={12} className="h-full w-full" zoomControl={false} attributionControl>
        <TileLayer
          url={mapConfig.tileUrl}
          attribution={mapConfig.attribution}
          eventHandlers={{
            tileload: () => {
              loaded.current = true;
            },
            tileerror: () => {
              errors.current++;
              if (!loaded.current && errors.current >= 4) onTilesFailed?.();
            },
          }}
        />
        {restaurants.map((r) =>
          restaurants.length > DENSE_THRESHOLD && r.id !== selectedId ? (
            <CircleMarker
              key={r.id}
              center={[r.latitude, r.longitude]}
              radius={5}
              pathOptions={{ color: '#fff', weight: 1.5, fillColor: CATEGORY_DOT[r.category], fillOpacity: 0.95 }}
              eventHandlers={{ click: () => onSelect?.(r.id) }}
            />
          ) : (
          <Marker
            key={r.id}
            position={[r.latitude, r.longitude]}
            icon={pin(markerIcon(r), r.id === selectedId)}
            zIndexOffset={r.id === selectedId ? 1000 : 0}
            eventHandlers={{ click: () => onSelect?.(r.id) }}
            title={r.nameEn}
          />
          ),
        )}
        {userLocation && (
          <CircleMarker
            center={[userLocation.latitude, userLocation.longitude]}
            radius={9}
            pathOptions={{ color: '#fff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }}
          />
        )}
        <FlyToSelected target={selected ? [selected.latitude, selected.longitude] : null} />
      </MapContainer>
    </div>
  );
}
