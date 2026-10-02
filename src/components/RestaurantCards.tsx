import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { Distance, Price, Rating, useLabels } from './Badges';
import { RestaurantImage } from './RestaurantImage';
import { HeartIcon } from './Navigation';

/** Compact vertical card for horizontal rows (recent picks on home). */
export function RestaurantMiniCard({ restaurant: r, caption }: { restaurant: Restaurant; caption?: string }) {
  const { name } = useApp();
  const L = useLabels();
  return (
    <Link
      to={`/restaurant/${r.id}`}
      className="card group block w-44 shrink-0 overflow-hidden lg:w-auto transition hover:-translate-y-0.5 hover:shadow-lift sm:w-52"
    >
      <RestaurantImage restaurant={r} className="block h-24 w-full transition-transform duration-500 group-hover:scale-105 sm:h-28" />
      <div className="p-3">
        <div className="truncate font-semibold">{name(r)}</div>
        <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-ink-mute">
          <span className="truncate">
            {L.cuisineIcon(r)} {L.cuisine(r)}
          </span>
          <Rating value={r.rating} />
        </div>
        {caption && <div className="mt-1 text-[11px] text-ink-mute">{caption}</div>}
      </div>
    </Link>
  );
}

/** Horizontal list row (favorites, history, map list). */
export function RestaurantRow({
  restaurant: r,
  meta,
  actions,
  selected,
  onSelect,
}: {
  restaurant: Restaurant;
  meta?: ReactNode;
  actions?: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { name } = useApp();
  const L = useLabels();
  const body = (
    <>
      <RestaurantImage restaurant={r} className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{name(r)}</div>
        <div className="mt-0.5 truncate text-sm text-ink-mute">
          {L.cuisineIcon(r)} {L.cuisine(r)} · {L.area(r)}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Rating value={r.rating} />
          <Price level={r.priceLevel} />
          <Distance restaurant={r} />
        </div>
        {meta && <div className="mt-1 text-xs text-ink-mute">{meta}</div>}
      </div>
    </>
  );
  return (
    <div
      className={`card flex items-center gap-3 p-3 transition ${selected ? 'ring-2 ring-palm-500' : ''}`}
      data-testid="restaurant-row"
    >
      {onSelect ? (
        <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 text-start">
          {body}
        </button>
      ) : (
        <Link to={`/restaurant/${r.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          {body}
        </Link>
      )}
      {actions && <div className="flex shrink-0 flex-col gap-1.5">{actions}</div>}
    </div>
  );
}

export function FavoriteToggle({ restaurant }: { restaurant: Restaurant }) {
  const { favorites, toggleFavorite, t } = useApp();
  const on = favorites.isFavorite(restaurant.id);
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(restaurant)}
      aria-pressed={on}
      aria-label={on ? t.remove : t.save}
      className={`grid h-11 w-11 place-items-center rounded-full border transition active:scale-90 ${
        on ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-sand-300 bg-white text-ink-mute hover:text-rose-500'
      }`}
    >
      <HeartIcon filled={on} className="h-5 w-5" />
    </button>
  );
}

export function SkeletonRows({ n = 3 }: { n?: number }) {
  return (
    <div className="space-y-3" aria-busy>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="card flex items-center gap-3 p-3">
          <div className="skeleton h-20 w-20" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
