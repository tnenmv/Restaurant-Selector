import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { usePicker } from '../hooks/usePicker';
import { restaurantService } from '../services/restaurantService';
import { applyQuery, EMPTY_FILTERS } from '../utils/filters';
import type { SmartPreference } from '../types';
import { PickButton } from '../components/PickButton';
import { PickerStage } from '../components/PickerStage';
import { ModeToggle } from '../components/ModeToggle';
import { SmartPreferences } from '../components/SmartPreferences';
import { FilterPanel } from '../components/FilterPanel';
import { Chip } from '../components/Chip';
import { RestaurantMiniCard } from '../components/RestaurantCards';
import { EmptyState } from '../components/EmptyState';
import { LocationButton } from '../components/LocationButton';
import { PrototypeNote } from '../components/PrototypeNote';

export function HomePage() {
  const app = useApp();
  const { t, restaurants, status, history, filters, setFilters, preferences, setPreferences, homeMode, setHomeMode, geo, disliked, dislike, toast, getById } = app;
  const [optionsOpen, setOptionsOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const smart = homeMode === 'smart';
  const activePrefs = useMemo(() => (smart ? preferences : []), [smart, preferences]);

  const recentIds = useMemo(() => history.entries.map((e) => e.restaurantId), [history.entries]);
  const picker = usePicker({
    visualPool: restaurants,
    recentIds,
    onPicked: (r, mode) => history.add(r.id, mode),
  });

  const matchCount = useMemo(
    () => applyQuery(restaurants, { filters, preferences: activePrefs, origin: geo.location }).length,
    [restaurants, filters, activePrefs, geo.location],
  );

  const run = useCallback(
    (excludeId?: string) => {
      const exclude = new Set([...disliked, ...(excludeId ? [excludeId] : [])]);
      void picker.spin(async () => {
        let origin = geo.location;
        if (activePrefs.includes('nearMe') && !origin) {
          origin = await geo.request();
          if (!origin) toast(`📍 ${t.locationDenied}`);
        }
        const pool = await restaurantService.searchRestaurants({ filters, preferences: activePrefs, origin });
        const fresh = pool.filter((r) => !exclude.has(r.id));
        return fresh.length ? fresh : pool;
      }, smart ? 'smart' : 'random');
      requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    },
    [disliked, picker, geo, activePrefs, filters, smart, toast, t],
  );

  // Support /?spin=1 (e.g. "pick again" from a details page).
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (params.get('spin') && status === 'ready') {
      setParams({}, { replace: true });
      run();
    }
  }, [params, status, run, setParams]);

  const resetAll = () => {
    setFilters(EMPTY_FILTERS);
    setPreferences([]);
    picker.reset();
  };
  const editOptions = () => {
    setOptionsOpen(true);
    picker.reset();
    setTimeout(() => document.getElementById('pick-options')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const togglePref = (p: SmartPreference) => {
    const on = !preferences.includes(p);
    setPreferences(on ? [...preferences, p] : preferences.filter((x) => x !== p));
    if (on) setHomeMode('smart');
    if (on && p === 'nearMe' && geo.status !== 'granted') void geo.request();
  };

  const spinning = picker.phase === 'spinning';
  const recent = history.entries.map((e) => getById(e.restaurantId)).filter(Boolean).slice(0, 8);

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <EmptyState emoji="📡" title={t.apiErrorTitle} description={t.apiErrorDesc}>
          <button type="button" className="btn-primary" onClick={app.retry}>
            {t.retry}
          </button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:gap-10 lg:pt-6">
      {/* ── Main column: the one-button experience ── */}
      <div className="space-y-5">
        <section className="relative -mx-4 overflow-hidden bg-palm-pattern px-4 pb-2 pt-8 text-center sm:mx-0 sm:rounded-4xl sm:pt-10">
          <div className="pointer-events-none absolute -top-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-palm-200/40 blur-3xl" aria-hidden />
          <h1 className="relative font-display text-5xl font-bold tracking-tight text-palm-800 sm:text-6xl">{t.appName}</h1>
          <p className="relative mt-2 font-display text-xl font-semibold text-date-600">{t.tagline}</p>
          <p className="relative mx-auto mt-3 max-w-sm text-[15px] text-ink-soft">
            <span className="block font-semibold text-ink">«{t.heroQuestion}»</span>
            {t.heroDesc}
          </p>
        </section>

        <ModeToggle />

        <PickButton
          onClick={() => run()}
          loading={spinning || status === 'loading'}
          label={smart ? t.smartPick : t.pickForMe}
          loadingLabel={status === 'loading' ? t.loading : t.picking}
          variant={smart ? 'gold' : 'green'}
          icon={smart ? '✨' : '🎲'}
        />
        <p className="-mt-2 text-center text-xs text-ink-mute" aria-live="polite">
          {status === 'ready' ? t.matches(matchCount) : '\u00a0'}
        </p>

        {smart && <SmartPreferences />}

        <div ref={stageRef} className="scroll-mt-24">
          <PickerStage
            phase={picker.phase}
            reel={picker.reel}
            tick={picker.tick}
            result={picker.result}
            onPickAgain={() => run(picker.result?.id)}
            onDislike={
              picker.result
                ? () => {
                    dislike(picker.result!.id);
                    run(picker.result!.id);
                  }
                : undefined
            }
            emptyActions={
              <>
                <button type="button" className="btn-primary flex-1" onClick={editOptions}>
                  ⚙️ {t.editOptions}
                </button>
                <button type="button" className="btn-ghost flex-1" onClick={resetAll} data-testid="reset-filters">
                  ↺ {t.resetFilters}
                </button>
              </>
            }
          />
        </div>

        {!smart && (
          <section className="space-y-3">
            <h2 className="text-center text-sm font-semibold text-ink-mute">— {t.orPrefs} —</h2>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:justify-center">
              <Chip size="lg" icon="📍" active={false} onClick={() => togglePref('nearMe')}>
                {app.lang === 'ar' ? 'قريب مني' : 'Near me'}
              </Chip>
              <Chip size="lg" icon="💰" active={filters.prices.includes(1)} onClick={() => setFilters({ ...filters, prices: filters.prices.includes(1) ? filters.prices.filter((p) => p !== 1) : [...filters.prices, 1] })}>
                {app.lang === 'ar' ? 'اقتصادي' : 'Budget'}
              </Chip>
              <Chip size="lg" icon="👨‍👩‍👧" active={false} onClick={() => togglePref('family')}>
                {app.lang === 'ar' ? 'عائلي' : 'Family'}
              </Chip>
              <Chip size="lg" icon="🍔" active={filters.cuisines.includes('burger')} onClick={() => setFilters({ ...filters, cuisines: filters.cuisines.includes('burger') ? filters.cuisines.filter((c) => c !== 'burger') : [...filters.cuisines, 'burger'] })}>
                {app.lang === 'ar' ? 'برجر' : 'Burger'}
              </Chip>
              <Chip size="lg" icon="☕" active={filters.categories.includes('cafe')} onClick={() => setFilters({ ...filters, categories: filters.categories.includes('cafe') ? filters.categories.filter((c) => c !== 'cafe') : [...filters.categories, 'cafe'] })}>
                {app.lang === 'ar' ? 'كافيه' : 'Café'}
              </Chip>
            </div>
          </section>
        )}
      </div>

      {/* ── Side column: supporting tools ── */}
      <div className="mt-6 space-y-5 lg:mt-0">
        <FilterPanel open={optionsOpen} onOpenChange={setOptionsOpen} matchCount={matchCount} />

        <div className="card flex items-center justify-between gap-3 p-4">
          <div className="text-sm text-ink-soft">
            <div className="font-semibold text-ink">🧭 {t.useMyLocation}</div>
            <div className="text-xs text-ink-mute">{app.lang === 'ar' ? 'اختياري — لحساب المسافة وترتيب الأقرب' : 'Optional — for distances and nearby picks'}</div>
          </div>
          <LocationButton compact />
        </div>

        <Link
          to="/group"
          className="group relative block overflow-hidden rounded-4xl bg-gradient-to-br from-fuchsia-500 via-date-500 to-palm-500 p-5 text-white shadow-lift transition hover:-translate-y-0.5"
          data-testid="group-entry"
        >
          <span className="absolute -end-4 -top-4 text-7xl opacity-25 transition group-hover:rotate-12" aria-hidden>
            🎉
          </span>
          <span className="block font-display text-xl font-bold">👥 {t.groupMode}</span>
          <span className="mt-1 block text-sm text-white/90">{t.groupTeaser}</span>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold backdrop-blur">
            {t.groupGo} {app.dir === 'rtl' ? '←' : '→'}
          </span>
        </Link>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">🕘 {t.recentPicks}</h2>
            {recent.length > 0 && (
              <Link to="/history" className="text-sm font-semibold text-palm-700 hover:underline">
                {t.seeAll}
              </Link>
            )}
          </div>
          {recent.length ? (
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:px-0">
              {recent.map((r) => (
                <RestaurantMiniCard key={r!.id} restaurant={r!} />
              ))}
            </div>
          ) : (
            <EmptyState compact emoji="🕘" title={t.noHistoryTitle} description={t.noHistoryDesc} />
          )}
        </section>

        <PrototypeNote />
      </div>
    </div>
  );
}
