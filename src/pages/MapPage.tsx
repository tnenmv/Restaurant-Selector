import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapView } from '../components/map/MapView';
import { RestaurantRow, SkeletonRows, FavoriteToggle } from '../components/RestaurantCards';
import { Distance, Price, Rating, useLabels } from '../components/Badges';
import { LocationButton } from '../components/LocationButton';
import { RestaurantImage } from '../components/RestaurantImage';
import { Chip } from '../components/Chip';
import { CUISINES } from '../data/options';
import { directionsUrl } from '../utils/geo';
import type { Cuisine } from '../types';

export function MapPage() {
  const { t, lang, restaurants, status, geo, distanceTo, name } = useApp();
  const L = useLabels();
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(params.get('focus'));
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);

  useEffect(() => {
    const f = params.get('focus');
    if (f) setSelectedId(f);
  }, [params]);

  const select = (id: string) => {
    setSelectedId(id);
    setParams({ focus: id }, { replace: true });
  };

  const visible = useMemo(() => {
    const list = cuisine ? restaurants.filter((r) => r.cuisine === cuisine || r.id === selectedId) : restaurants;
    return [...list].sort((a, b) => (geo.location ? distanceTo(a)! - distanceTo(b)! : b.rating - a.rating));
  }, [restaurants, cuisine, geo.location, distanceTo, selectedId]);

  const selected = restaurants.find((r) => r.id === selectedId);
  const usedCuisines = CUISINES.filter((c) => restaurants.some((r) => r.cuisine === c.value));

  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 pb-10 pt-4 lg:grid lg:grid-cols-[380px_1fr] lg:gap-6 lg:pt-6">
      <div className="order-2 lg:order-1">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-2xl font-bold">🗺️ {t.mapTitle}</h1>
          <LocationButton />
        </div>
        <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          <Chip active={cuisine === null} onClick={() => setCuisine(null)}>
            {lang === 'ar' ? 'الكل' : 'All'}
          </Chip>
          {usedCuisines.map((c) => (
            <Chip key={c.value} icon={c.icon} active={cuisine === c.value} onClick={() => setCuisine(cuisine === c.value ? null : c.value)}>
              {lang === 'ar' ? c.ar : c.en}
            </Chip>
          ))}
        </div>
        <h2 className="mb-2 text-sm font-semibold text-ink-mute">{geo.location ? `🧭 ${t.nearest}` : t.allRestaurants}</h2>
        {status === 'loading' ? (
          <SkeletonRows />
        ) : (
          <ul className="space-y-3 lg:max-h-[calc(100dvh-260px)] lg:overflow-y-auto lg:pe-1">
            {visible.map((r) => (
              <li key={r.id}>
                <RestaurantRow restaurant={r} selected={r.id === selectedId} onSelect={() => select(r.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="order-1 mb-5 lg:order-2 lg:mb-0">
        <div className="relative lg:sticky lg:top-24">
          <MapView
            restaurants={visible}
            selectedId={selectedId}
            onSelect={select}
            userLocation={geo.location}
            className="h-[52dvh] min-h-[320px] rounded-4xl border border-sand-200 shadow-soft lg:h-[calc(100dvh-140px)]"
          />
          {selected && (
            <div className="absolute inset-x-3 bottom-3 z-[500] animate-pop-in" data-testid="map-selected">
              <div className="card flex gap-3 p-3">
                <RestaurantImage restaurant={selected} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-display font-bold">{name(selected)}</div>
                      <div className="truncate text-xs text-ink-mute">
                        {L.cuisineIcon(selected)} {L.cuisine(selected)} · {L.area(selected)}
                      </div>
                    </div>
                    <FavoriteToggle restaurant={selected} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Rating value={selected.rating} />
                    <Price level={selected.priceLevel} />
                    <Distance restaurant={selected} />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Link to={`/restaurant/${selected.id}`} className="btn-soft min-h-[40px] flex-1 px-2 text-sm">
                      {t.details}
                    </Link>
                    <a href={directionsUrl(selected, geo.location)} target="_blank" rel="noreferrer" className="btn-primary min-h-[40px] flex-1 whitespace-nowrap px-2 text-sm">
                      🧭 {t.directions}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
