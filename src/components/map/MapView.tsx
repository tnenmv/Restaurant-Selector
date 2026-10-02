import { lazy, Suspense, useCallback, useState } from 'react';
import { mapConfig } from '../../services/map/mapConfig';
import { useApp } from '../../context/AppContext';
import { SchematicMapView } from './SchematicMapView';
import type { MapViewProps } from './types';

const LeafletMapView = lazy(() => import('./LeafletMapView').then((m) => ({ default: m.LeafletMapView })));

/**
 * The only map component pages use. Chooses a provider from `mapConfig` and
 * falls back to the schematic view when the provider/tiles are unavailable.
 * To add Google Maps: create GoogleMapView implementing MapViewProps and add a case here.
 */
export function MapView(props: MapViewProps) {
  const { t } = useApp();
  const [failed, setFailed] = useState(mapConfig.provider === 'schematic');
  const onFail = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      <div className={`relative ${props.className ?? ''}`}>
        <SchematicMapView {...props} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex justify-center">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink-soft shadow-soft">
            🗺️ {mapConfig.provider === 'schematic' ? t.mapSchematicNote : t.mapFallback}
          </span>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<div className={`skeleton ${props.className ?? ''}`} />}>
      <LeafletMapView {...props} onTilesFailed={onFail} />
    </Suspense>
  );
}
