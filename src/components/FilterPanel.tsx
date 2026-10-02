import type { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { AREAS, CATEGORIES, CUISINES, PRICES, RATINGS, type Option } from '../data/options';
import type { RestaurantFilters } from '../types';
import { EMPTY_FILTERS, countActiveFilters } from '../utils/filters';
import { Chip } from './Chip';

function toggleIn<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function FilterPanel({
  open,
  onOpenChange,
  matchCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchCount: number;
}) {
  const { t, lang, filters, setFilters } = useApp();
  const active = countActiveFilters(filters);
  const L = (o: Option<unknown>) => (lang === 'ar' ? o.ar : o.en);
  const update = (patch: Partial<RestaurantFilters>) => setFilters({ ...filters, ...patch });

  return (
    <section id="pick-options" className="card overflow-hidden">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-palm-50 text-lg" aria-hidden>
            ⚙️
          </span>
          <span>
            <span className="block font-display font-semibold">{t.options}</span>
            <span className="block text-xs text-ink-mute">{t.matches(matchCount)}</span>
          </span>
        </span>
        <span className="flex items-center gap-2">
          {active > 0 && (
            <span className="rounded-full bg-palm-600 px-2 py-0.5 text-xs font-bold text-white">{t.activeFilters(active)}</span>
          )}
          <svg viewBox="0 0 20 20" className={`h-5 w-5 text-ink-mute transition-transform ${open ? 'rotate-180' : ''}`} fill="currentColor" aria-hidden>
            <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
          </svg>
        </span>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="space-y-5 border-t border-sand-200 px-5 pb-5 pt-4">
            <Group title={`🍽️ ${t.cuisine}`}>
              {CUISINES.map((o) => (
                <Chip key={o.value} icon={o.icon} active={filters.cuisines.includes(o.value)} onClick={() => update({ cuisines: toggleIn(filters.cuisines, o.value) })}>
                  {L(o)}
                </Chip>
              ))}
            </Group>
            <Group title={`💰 ${t.price}`}>
              {PRICES.map((o) => (
                <Chip key={o.value} active={filters.prices.includes(o.value)} onClick={() => update({ prices: toggleIn(filters.prices, o.value) })}>
                  <span dir="ltr" className="font-bold opacity-70">{o.icon}</span> {L(o)}
                </Chip>
              ))}
            </Group>
            <Group title={`📍 ${t.area}`}>
              {AREAS.map((o) => (
                <Chip key={o.value} active={filters.areas.includes(o.value)} onClick={() => update({ areas: toggleIn(filters.areas, o.value) })}>
                  {L(o)}
                </Chip>
              ))}
            </Group>
            <Group title={`🏷️ ${t.placeType}`}>
              {CATEGORIES.map((o) => (
                <Chip key={o.value} icon={o.icon} active={filters.categories.includes(o.value)} onClick={() => update({ categories: toggleIn(filters.categories, o.value) })}>
                  {L(o)}
                </Chip>
              ))}
            </Group>
            <Group title={`⭐ ${t.rating}`}>
              {RATINGS.map((o) => (
                <Chip key={o.value} active={filters.minRating === o.value} onClick={() => update({ minRating: o.value })}>
                  {L(o)}
                </Chip>
              ))}
            </Group>
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-sm font-medium text-palm-700">{t.matches(matchCount)}</span>
              <button
                type="button"
                className="text-sm font-semibold text-ink-mute underline-offset-4 hover:text-rose-600 hover:underline disabled:opacity-40"
                disabled={active === 0}
                onClick={() => setFilters(EMPTY_FILTERS)}
              >
                ↺ {t.resetFilters}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink-soft">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

