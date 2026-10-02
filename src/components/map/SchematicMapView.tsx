import { useMemo } from 'react';
import { AREAS, MADINAH_CENTER } from '../../data/options';
import { useApp } from '../../context/AppContext';
import { markerIcon } from './markers';
import type { MapViewProps } from './types';

const W = 1000;
const H = 760;

/**
 * Offline, dependency-free stand-in used when no map provider/tiles are
 * available. Positions are projected from real lat/lng so it stays roughly
 * faithful; swap in any provider via MapView without touching pages.
 */
export function SchematicMapView({ restaurants, selectedId, onSelect, userLocation, className = '' }: MapViewProps) {
  const { lang, name } = useApp();

  const project = useMemo(() => {
    const pts = [...restaurants.map((r) => [r.latitude, r.longitude]), ...AREAS.map((a) => a.center)];
    if (userLocation) pts.push([userLocation.latitude, userLocation.longitude]);
    const lats = pts.map((p) => p[0]);
    const lngs = pts.map((p) => p[1]);
    const pad = 0.012;
    const minLat = Math.min(...lats) - pad,
      maxLat = Math.max(...lats) + pad;
    const minLng = Math.min(...lngs) - pad,
      maxLng = Math.max(...lngs) + pad;
    return (lat: number, lng: number) => ({
      x: ((lng - minLng) / (maxLng - minLng)) * W,
      y: (1 - (lat - minLat) / (maxLat - minLat)) * H,
    });
  }, [restaurants, userLocation]);

  const haram = project(MADINAH_CENTER[0], MADINAH_CENTER[1]);
  const me = userLocation ? project(userLocation.latitude, userLocation.longitude) : null;

  return (
    <div dir="ltr" className={`overflow-hidden bg-[#eef3ec] ${/\babsolute\b/.test(className) ? '' : 'relative '}${className}`} data-testid="schematic-map">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0H0V50" fill="none" stroke="#18794e" strokeOpacity=".06" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        {/* ring roads around the centre, like Madinah's King Faisal / King Abdullah / King Khalid rings */}
        {[90, 210, 360].map((r, i) => (
          <circle key={r} cx={haram.x} cy={haram.y} r={r} fill="none" stroke="#fff" strokeWidth={i === 0 ? 10 : 14} strokeOpacity=".95" />
        ))}
        {[90, 210, 360].map((r) => (
          <circle key={`b${r}`} cx={haram.x} cy={haram.y} r={r} fill="none" stroke="#d6cdb8" strokeWidth="1" />
        ))}
        {/* radial roads */}
        {[15, 70, 130, 200, 250, 320].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <line key={deg} x1={haram.x} y1={haram.y} x2={haram.x + Math.cos(a) * 900} y2={haram.y + Math.sin(a) * 900} stroke="#fff" strokeWidth="8" />
          );
        })}
        {AREAS.map((a) => {
          const p = project(a.center[0], a.center[1]);
          return (
            <text key={a.value} x={p.x} y={p.y + 46} textAnchor="middle" fontSize="20" fontWeight="600" fill="#134d37" fillOpacity=".45" fontFamily="inherit">
              {lang === 'ar' ? a.ar : a.en}
            </text>
          );
        })}
        <circle cx={haram.x} cy={haram.y} r="16" fill="#18794e" fillOpacity=".15" />
        <text x={haram.x} y={haram.y + 8} textAnchor="middle" fontSize="22">
          🕌
        </text>
      </svg>

      {restaurants.map((r) => {
        const p = project(r.latitude, r.longitude);
        const sel = r.id === selectedId;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect?.(r.id)}
            aria-label={name(r)}
            aria-pressed={sel}
            className={`absolute -translate-x-1/2 -translate-y-full transition-transform ${sel ? 'z-20 scale-125' : 'z-10 hover:scale-110'}`}
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
          >
            <span
              className={`grid h-9 w-9 -rotate-45 place-items-center rounded-[50%_50%_50%_4px] border-[3px] border-white shadow-lg ${
                sel ? 'bg-date-500' : 'bg-palm-600'
              }`}
            >
              <span className="rotate-45 text-base">{markerIcon(r)}</span>
            </span>
          </button>
        );
      })}
      {me && (
        <span
          className="absolute z-30 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-blue-600 shadow-[0_0_0_8px_rgba(37,99,235,.2)]"
          style={{ left: `${(me.x / W) * 100}%`, top: `${(me.y / H) * 100}%` }}
          aria-hidden
        />
      )}
    </div>
  );
}
