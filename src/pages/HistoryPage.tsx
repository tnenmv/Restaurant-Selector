import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { usePicker } from '../hooks/usePicker';
import { EmptyState } from '../components/EmptyState';
import { FavoriteToggle, RestaurantRow, SkeletonRows } from '../components/RestaurantCards';
import { PickerOverlay } from '../components/PickerOverlay';
import { PageHeader } from '../components/PageHeader';

export function HistoryPage() {
  const { t, history, getById, status } = useApp();
  const [confirming, setConfirming] = useState(false);
  const items = history.entries
    .map((e) => ({ e, r: getById(e.restaurantId) }))
    .filter((x): x is { e: typeof x.e; r: NonNullable<typeof x.r> } => x.r !== undefined);
  const pool = items.map((x) => x.r);
  const picker = usePicker({
    visualPool: pool,
    // When re-picking from history, avoid only the latest couple of picks.
    recentIds: pool.slice(0, 2).map((r) => r.id),
    onPicked: (r) => history.add(r.id, 'history'),
  });
  const pick = () => void picker.spin(() => pool, 'history');
  const minsAgo = (ts: number) => Math.floor((Date.now() - ts) / 60000);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6">
      <PageHeader title={`🕘 ${t.historyTitle}`} count={items.length}>
        {items.length > 0 && (
          <>
            <button type="button" className="btn-primary" onClick={pick} data-testid="pick-history">
              🎲 {t.pickFromHistory}
            </button>
            {confirming ? (
              <button
                type="button"
                className="btn border border-rose-200 bg-rose-50 text-rose-700"
                onClick={() => {
                  history.clear();
                  setConfirming(false);
                }}
                onBlur={() => setConfirming(false)}
                autoFocus
              >
                🗑️ {t.confirmClear}
              </button>
            ) : (
              <button type="button" className="btn-ghost" onClick={() => setConfirming(true)}>
                🗑️ {t.clearHistory}
              </button>
            )}
          </>
        )}
      </PageHeader>
      {status === 'loading' ? (
        <SkeletonRows />
      ) : items.length === 0 ? (
        <EmptyState emoji="🕘" title={t.noHistoryTitle} description={t.noHistoryDesc}>
          <Link to="/" className="btn-primary">
            🎲 {t.startPicking}
          </Link>
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2" data-testid="history-list">
          {items.map(({ e, r }) => (
            <li key={e.restaurantId} className="min-w-0 animate-fade-up">
              <RestaurantRow
                restaurant={r}
                meta={
                  <>
                    {t.ago(minsAgo(e.pickedAt))} · {t.modeLabels[e.mode]}
                  </>
                }
                actions={
                  <>
                    <FavoriteToggle restaurant={r} />
                    <button
                      type="button"
                      onClick={() => history.remove(r.id)}
                      aria-label={t.remove}
                      title={t.remove}
                      className="grid h-11 w-11 place-items-center rounded-full border border-sand-300 bg-white text-ink-mute transition hover:border-rose-200 hover:text-rose-500 active:scale-90"
                    >
                      ✕
                    </button>
                  </>
                }
              />
            </li>
          ))}
        </ul>
      )}
      <PickerOverlay picker={picker} onPickAgain={pick} title={`🎲 ${t.pickFromHistory}`} />
    </div>
  );
}
