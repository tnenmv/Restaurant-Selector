import type { ReactNode } from 'react';
import type { PriceLevel, Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { AREAS, CATEGORIES, CUISINES, PRICES, findOption } from '../data/options';
import { formatDistance } from '../utils/geo';

export function Rating({ value, size = 'sm' }: { value: number | null; size?: 'sm' | 'lg' }) {
  const { t } = useApp();
  if (value === null) {
    return size === 'lg' ? <span className="text-sm text-ink-mute">☆ {t.noRating}</span> : null;
  }
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold text-ink ${size === 'lg' ? 'text-base' : 'text-sm'}`}
      aria-label={`${value} / 5`}
    >
      <svg viewBox="0 0 20 20" className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} fill="#e2a032" aria-hidden>
        <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.8 4.9 17.4l1-5.6-4.1-4 5.7-.8z" />
      </svg>
      <span dir="ltr">{value.toFixed(1)}</span>
    </span>
  );
}

export function Price({ level }: { level: PriceLevel | null }) {
  const { lang } = useApp();
  if (level === null) return null;
  const opt = findOption(PRICES, level)!;
  return (
    <span className="inline-flex items-center gap-1 text-sm" title={lang === 'ar' ? opt.ar : opt.en}>
      <span dir="ltr" className="font-semibold tracking-tight">
        <span className="text-palm-700">{'$'.repeat(level)}</span>
        <span className="text-ink-mute/40">{'$'.repeat(3 - level)}</span>
      </span>
      <span className="text-ink-mute">· {lang === 'ar' ? opt.ar : opt.en}</span>
    </span>
  );
}

export function Pill({ children, tone = 'sand' }: { children: ReactNode; tone?: 'sand' | 'green' | 'red' | 'gold' }) {
  const tones = {
    sand: 'bg-sand-200 text-ink-soft',
    green: 'bg-palm-50 text-palm-700 border border-palm-100',
    red: 'bg-rose-50 text-rose-700 border border-rose-100',
    gold: 'bg-date-50 text-date-700 border border-date-100',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function useLabels() {
  const { lang } = useApp();
  const pick = (o?: { ar: string; en: string; icon: string }) => (o ? (lang === 'ar' ? o.ar : o.en) : '');
  return {
    cuisine: (r: Restaurant) => pick(findOption(CUISINES, r.cuisine)),
    cuisineIcon: (r: Restaurant) => findOption(CUISINES, r.cuisine)?.icon ?? '🍽️',
    category: (r: Restaurant) => pick(findOption(CATEGORIES, r.category)),
    area: (r: Restaurant) => pick(findOption(AREAS, r.area)),
    address: (r: Restaurant) => (lang === 'ar' ? r.address : r.addressEn),
    description: (r: Restaurant) => (lang === 'ar' ? r.description : r.descriptionEn),
  };
}

export function Distance({ restaurant }: { restaurant: Restaurant }) {
  const { distanceTo, lang, t } = useApp();
  const d = distanceTo(restaurant);
  if (d === undefined) return null;
  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
      <span aria-hidden>🧭</span>
      {formatDistance(d, lang)} {t.away}
    </span>
  );
}

export function FeatureBadges({ restaurant: r }: { restaurant: Restaurant }) {
  const { t } = useApp();
  return (
    <div className="flex flex-wrap gap-1.5">
      {r.openNow === true && <Pill tone="green">● {t.openNow}</Pill>}
      {r.openNow === false && <Pill tone="red">● {t.closed}</Pill>}
      {r.familyFriendly && <Pill>👨‍👩‍👧 {t.familyFriendly}</Pill>}
      {r.outdoorSeating && <Pill>🌴 {t.outdoor}</Pill>}
      {r.quiet && <Pill>🤫 {t.quiet}</Pill>}
      {r.groupFriendly && <Pill>👥 {t.groups}</Pill>}
    </div>
  );
}

/** Shown only on fictional prototype records. */
export function SampleBadge({ restaurant, className = '' }: { restaurant: Restaurant; className?: string }) {
  const { t } = useApp();
  if (!restaurant.isSample) return null;
  return (
    <span
      title={t.sampleNote}
      className={`inline-flex items-center gap-1 rounded-full bg-date-100/90 px-2 py-0.5 text-[11px] font-semibold text-date-800 ${className}`}
    >
      🧪 {t.sampleBadge}
    </span>
  );
}

/** Website / phone / data-source line for real-world records. */
export function SourceInfo({ restaurant: r, showContact = true }: { restaurant: Restaurant; showContact?: boolean }) {
  const { t } = useApp();
  if (r.isSample) return null;
  const site = r.website?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return (
    <div className="space-y-1.5 text-sm">
      {showContact && (r.website || r.phone) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {r.website && (
            <a href={r.website} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 font-medium text-palm-700 hover:underline">
              🌐 <span className="truncate" dir="ltr">{site}</span>
            </a>
          )}
          {r.phone && (
            <span className="inline-flex items-center gap-1 text-ink-soft">
              📞 <a href={`tel:${r.phone}`} dir="ltr" className="select-all hover:text-palm-700">{r.phone}</a>
            </span>
          )}
        </div>
      )}
      <p className="text-xs text-ink-mute">
        {t.dataFrom} Overture Maps{r.sources?.length ? ` (${r.sources.join('، ')})` : ''} · {t.mayBeOutdated}
      </p>
    </div>
  );
}
