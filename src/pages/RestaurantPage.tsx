import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { restaurantService } from '../services/restaurantService';
import type { Restaurant } from '../types';
import { RestaurantImage } from '../components/RestaurantImage';
import { Distance, FeatureBadges, Price, Rating, SampleBadge, useLabels } from '../components/Badges';
import { HeartIcon } from '../components/Navigation';
import { MapView } from '../components/map/MapView';
import { EmptyState } from '../components/EmptyState';
import { directionsUrl } from '../utils/geo';

export function RestaurantPage() {
  const { id = '' } = useParams();
  const { t, lang, name, favorites, toggleFavorite, geo, toast, dir } = useApp();
  const L = useLabels();
  const nav = useNavigate();
  const [r, setR] = useState<Restaurant | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    setR(undefined);
    restaurantService
      .getRestaurantById(id)
      .then((x) => alive && setR(x ?? null))
      .catch(() => alive && setR(null));
    return () => {
      alive = false;
    };
  }, [id]);

  if (r === undefined)
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-6" aria-busy>
        <div className="skeleton h-64 w-full" />
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    );
  if (r === null)
    return (
      <div className="mx-auto max-w-xl px-4 pt-10">
        <EmptyState emoji="🔍" title={t.notFound}>
          <Link to="/" className="btn-primary">
            {t.back}
          </Link>
        </EmptyState>
      </div>
    );

  const saved = favorites.isFavorite(r.id);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: name(r), url });
      else {
        await navigator.clipboard.writeText(url);
        toast(t.copied);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-4" data-testid="restaurant-page">
      <button type="button" onClick={() => (history.length > 1 ? nav(-1) : nav('/'))} className="mb-3 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-ink-soft hover:text-palm-700">
        {dir === 'rtl' ? '→' : '←'} {t.back}
      </button>
      <article className="card overflow-hidden animate-fade-up">
        <div className="relative">
          <RestaurantImage restaurant={r} className="block h-60 w-full sm:h-80" />
          <SampleBadge className="absolute end-4 top-4" />
        </div>
        <div className="space-y-4 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold">{name(r)}</h1>
              <p className="mt-1 text-ink-mute">
                {L.cuisineIcon(r)} {L.cuisine(r)} · {L.category(r)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(r)}
              aria-pressed={saved}
              aria-label={saved ? t.saved : t.save}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border transition active:scale-90 ${
                saved ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-sand-300 bg-white text-ink-mute hover:text-rose-500'
              }`}
            >
              <HeartIcon filled={saved} className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Rating value={r.rating} size="lg" />
            <Price level={r.priceLevel} />
            <Distance restaurant={r} />
          </div>
          <p className="leading-relaxed text-ink-soft">{L.description(r)}</p>
          <FeatureBadges restaurant={r} />
          <div className="rounded-2xl bg-sand-100 p-4 text-sm">
            <div className="font-semibold">📍 {t.address}</div>
            <div className="mt-1 text-ink-soft">
              {L.address(r)} — {L.area(r)}{lang === 'ar' ? '، ' : ', '}{lang === 'ar' ? 'المدينة المنورة' : 'Madinah'}
            </div>
            <div className="mt-1 text-xs text-ink-mute" dir="ltr">
              {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)} ({t.approx})
            </div>
          </div>
          <MapView restaurants={[r]} selectedId={r.id} userLocation={geo.location} className="h-56 rounded-3xl border border-sand-200" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <a href={directionsUrl(r, geo.location)} target="_blank" rel="noreferrer" className="btn-primary">
              🧭 {t.directions}
            </a>
            <Link to={`/map?focus=${r.id}`} className="btn-soft">
              📍 {t.showLocation}
            </Link>
            <Link to="/?spin=1" className="btn-soft">
              🎲 {t.pickAgain}
            </Link>
            <button type="button" onClick={share} className="btn-ghost">
              🔗 {t.share}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
