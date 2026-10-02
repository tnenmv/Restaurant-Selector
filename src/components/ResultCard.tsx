import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { Distance, FeatureBadges, Price, Rating, SampleBadge, SourceInfo, useLabels } from './Badges';
import { RestaurantImage } from './RestaurantImage';
import { Confetti } from './Confetti';
import { HeartIcon } from './Navigation';

export function ResultCard({
  restaurant: r,
  onPickAgain,
  onDislike,
  celebrate = true,
  headline,
}: {
  restaurant: Restaurant;
  onPickAgain: () => void;
  onDislike?: () => void;
  celebrate?: boolean;
  headline?: string;
}) {
  const { t, name, favorites, toggleFavorite } = useApp();
  const L = useLabels();
  const nav = useNavigate();
  const saved = favorites.isFavorite(r.id);

  return (
    <article className="relative" data-testid="result-card" aria-live="polite">
      {celebrate && <Confetti key={r.id} />}
      <div className="card relative animate-pop-in overflow-hidden">
        <button type="button" className="relative block w-full text-start" onClick={() => nav(`/restaurant/${r.id}`)} aria-label={`${t.details}: ${name(r)}`}>
          <RestaurantImage restaurant={r} className="block h-52 w-full sm:h-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
          <div className="absolute start-4 top-4 flex gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-palm-700 shadow-sm backdrop-blur">
              {headline ?? t.youGot}
            </span>
          </div>
          <SampleBadge restaurant={r} className="absolute end-4 top-4" />
          <div className="absolute inset-x-4 bottom-4 text-white">
            <h2 className="font-display text-2xl font-bold leading-tight drop-shadow sm:text-3xl" data-testid="result-name">
              {name(r)}
            </h2>
            <p className="mt-1 text-sm text-white/90">
              {L.cuisineIcon(r)} {L.cuisine(r)} · {L.category(r)}
            </p>
          </div>
        </button>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Rating value={r.rating} size="lg" />
            <Price level={r.priceLevel} />
            <span className="inline-flex items-center gap-1 text-sm text-ink-soft">📍 {L.area(r)}</span>
            <Distance restaurant={r} />
          </div>
          {L.description(r) && <p className="text-[15px] leading-relaxed text-ink-soft">{L.description(r)}</p>}
          <FeatureBadges restaurant={r} />
          <SourceInfo restaurant={r} />

          <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-3">
            <button type="button" onClick={onPickAgain} className="btn-primary col-span-2 px-2 text-base sm:col-span-1" data-testid="pick-again">
              🎲 <span className="truncate">{t.pickAgain}</span>
            </button>
            <button type="button" onClick={() => nav(`/map?focus=${r.id}`)} className="btn-soft px-2 text-[14px] sm:text-base" data-testid="show-location">
              📍 <span className="truncate">{t.showLocation}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(r)}
              aria-pressed={saved}
              data-testid="save-button"
              className={`btn px-2 text-[14px] sm:text-base ${
                saved ? 'border border-rose-200 bg-rose-50 text-rose-600' : 'border border-sand-300 bg-white text-ink-soft hover:text-rose-600'
              }`}
            >
              <HeartIcon filled={saved} className={`h-5 w-5 ${saved ? 'animate-bounce-in' : ''}`} />
              <span className="truncate">{saved ? t.saved : t.save}</span>
            </button>
          </div>
          {onDislike && (
            <button
              type="button"
              onClick={onDislike}
              data-testid="dislike"
              className="mx-auto block min-h-[40px] text-sm font-medium text-ink-mute underline-offset-4 transition hover:text-rose-600 hover:underline"
            >
              👎 {t.dislike}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
