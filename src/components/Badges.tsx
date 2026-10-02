import type { ReactNode } from 'react';
import type { PriceLevel, Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { AREAS, CATEGORIES, CUISINES, PRICES, findOption } from '../data/options';
import { formatDistance } from '../utils/geo';

export function Rating({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
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

export function Price({ level }: { level: PriceLevel }) {
  const { lang } = useApp();
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
      {r.openNow ? <Pill tone="green">● {t.openNow}</Pill> : <Pill tone="red">● {t.closed}</Pill>}
      {r.familyFriendly && <Pill>👨‍👩‍👧 {t.familyFriendly}</Pill>}
      {r.outdoorSeating && <Pill>🌴 {t.outdoor}</Pill>}
      {r.quiet && <Pill>🤫 {t.quiet}</Pill>}
      {r.groupFriendly && <Pill>👥 {t.groups}</Pill>}
    </div>
  );
}

export function SampleBadge({ className = '' }: { className?: string }) {
  const { t } = useApp();
  return (
    <span
      title={t.sampleNote}
      className={`inline-flex items-center gap-1 rounded-full bg-date-100/90 px-2 py-0.5 text-[11px] font-semibold text-date-800 ${className}`}
    >
      🧪 {t.sampleBadge}
    </span>
  );
}
