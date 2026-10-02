import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { usePicker } from '../hooks/usePicker';
import { restaurantService } from '../services/restaurantService';
import { PickButton } from '../components/PickButton';
import { PickerStage } from '../components/PickerStage';
import { Chip } from '../components/Chip';
import { PRICE_RANGE_SAR } from '../data/options';
import type { SmartPreference } from '../types';
import { preferenceSupported } from '../utils/filters';

const FACES = ['😋', '🤤', '😎', '🥳', '🤩', '😄', '🙂', '😁', '🤠', '😇', '🧐', '😺'];

export function GroupPage() {
  const { t, lang, restaurants, history, dir } = useApp();
  const [people, setPeople] = useState(4);
  const canGroups = preferenceSupported(restaurants, 'groups');
  const canOpen = preferenceSupported(restaurants, 'openNow');
  const canBudget = preferenceSupported(restaurants, 'budget');
  const canFamily = preferenceSupported(restaurants, 'family');
  const [groupOnly, setGroupOnly] = useState(true);
  const [openOnly, setOpenOnly] = useState(false);
  const [budget, setBudget] = useState(false);

  const picker = usePicker({
    visualPool: restaurants,
    recentIds: history.entries.map((e) => e.restaurantId),
    onPicked: (r) => history.add(r.id, 'group'),
  });

  const prefs = useMemo(() => {
    const p: SmartPreference[] = [];
    if (groupOnly && canGroups) p.push('groups');
    if (openOnly && canOpen) p.push('openNow');
    if (budget && canBudget) p.push('budget');
    if (people >= 3 && !(groupOnly && canGroups) && canFamily) p.push('family');
    return p;
  }, [groupOnly, openOnly, budget, people, canGroups, canOpen, canBudget, canFamily]);

  const go = () => void picker.spin(() => restaurantService.searchRestaurants({ preferences: prefs }), 'group');
  const spinning = picker.phase === 'spinning';
  const r = picker.result;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4">
      <Link to="/" className="mb-3 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-ink-soft hover:text-palm-700">
        {dir === 'rtl' ? '→' : '←'} {t.home}
      </Link>

      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-fuchsia-500 via-date-500 to-palm-600 p-6 text-white shadow-lift sm:p-8">
        <h1 className="font-display text-3xl font-bold">👥 {t.groupMode}</h1>
        <p className="mt-1 text-white/90">{t.groupTeaser}</p>

        <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur">
          <label htmlFor="people" className="block text-center font-display text-lg font-semibold">
            {t.howMany}
          </label>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPeople((n) => Math.max(2, n - 1))}
              className="grid h-14 w-14 place-items-center rounded-2xl bg-white/25 text-3xl font-bold transition active:scale-90 disabled:opacity-40"
              disabled={people <= 2}
              aria-label="-"
            >
              −
            </button>
            <input
              id="people"
              data-testid="people-input"
              type="number"
              inputMode="numeric"
              min={2}
              max={30}
              value={people}
              onChange={(e) => setPeople(Math.min(30, Math.max(2, Number(e.target.value) || 2)))}
              className="w-24 rounded-2xl border-0 bg-white text-center font-display text-4xl font-bold text-date-700 shadow-inner focus:ring-4 focus:ring-white/50"
            />
            <button
              type="button"
              onClick={() => setPeople((n) => Math.min(30, n + 1))}
              className="grid h-14 w-14 place-items-center rounded-2xl bg-white/25 text-3xl font-bold transition active:scale-90 disabled:opacity-40"
              disabled={people >= 30}
              aria-label="+"
            >
              +
            </button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-1 text-2xl" aria-label={t.people(people)}>
            {Array.from({ length: Math.min(people, 12) }).map((_, i) => (
              <span key={i} className={`inline-block ${spinning ? 'animate-bounce' : ''}`} style={{ animationDelay: `${(i % 4) * 90}ms` }}>
                {FACES[i % FACES.length]}
              </span>
            ))}
            {people > 12 && <span className="self-center text-base font-bold">+{people - 12}</span>}
          </div>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {canGroups && (
          <Chip active={groupOnly} onClick={() => setGroupOnly((v) => !v)} icon="👥">
            {t.groupOnlyFriendly}
          </Chip>
        )}
        {canOpen && (
          <Chip active={openOnly} onClick={() => setOpenOnly((v) => !v)} icon="🟢">
            {t.openNow}
          </Chip>
        )}
        {canBudget && (
          <Chip active={budget} onClick={() => setBudget((v) => !v)} icon="💰">
            {lang === 'ar' ? 'مناسب للميزانية' : 'Budget friendly'}
          </Chip>
        )}
      </div>

      <div className="mt-5">
        <PickButton onClick={go} loading={spinning} label={t.groupGo} loadingLabel={t.groupLetsSee} variant="party" icon="🎉" />
      </div>

      <div className="mt-5 space-y-4">
        {(spinning || picker.phase === 'revealed') && (
          <p className="animate-fade-up text-center font-display text-lg font-semibold text-date-700">{t.groupLetsSee}</p>
        )}
        <PickerStage
          phase={picker.phase}
          reel={picker.reel}
          tick={picker.tick}
          result={r}
          onPickAgain={go}
          onDislike={go}
          party
          headline={`👥 ${t.people(people)}`}
          emptyActions={
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setGroupOnly(false);
                setOpenOnly(false);
                setBudget(false);
                picker.reset();
              }}
            >
              ↺ {t.resetFilters}
            </button>
          }
        />
        {picker.phase === 'revealed' && r && r.priceLevel === null && (
          <p className="text-center text-xs text-ink-mute">💸 {t.costUnknown}</p>
        )}
        {picker.phase === 'revealed' && r && r.priceLevel !== null && (
          <div className="card animate-fade-up p-4 text-center" data-testid="group-estimate">
            <div className="text-sm font-semibold text-ink-mute">💸 {t.groupEstimate}</div>
            <div className="mt-1 font-display text-2xl font-bold text-palm-700">
              <span dir="ltr">
                {PRICE_RANGE_SAR[r.priceLevel!][0] * people}–{PRICE_RANGE_SAR[r.priceLevel!][1] * people}
              </span>{' '}
              {t.sar}
            </div>
            <div className="text-xs text-ink-mute">
              ≈ {PRICE_RANGE_SAR[r.priceLevel!][0]}–{PRICE_RANGE_SAR[r.priceLevel!][1]} {t.sar} {t.perPerson} · {t.approx}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
